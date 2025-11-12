import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { FriendRequest, Group, Message, User } from "@shoot/shared";
import { MessageSquare, Search, Send, Settings, X } from "lucide-react";

import { api, type FriendRequestWithUser } from "@/api";
import { ApiError } from "@/api/client";
import { RecipientChip } from "@/components/recipient-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type FriendListItem,
  type GroupMessage,
  type GroupSummary,
  type IncomingRequest,
  type PotentialFriend,
} from "@/features/popup/types";
import { cn } from "@/lib/cn";
import { AddFriendsTab } from "@/popup/tabs/AddFriendsTab";
import { FriendsTab } from "@/popup/tabs/FriendsTab";
import { GroupsTab } from "@/popup/tabs/GroupsTab";
import { formatRelativeTime, formatTimeOfDay } from "@/utils/date";

type PopupTab = "friends" | "add-friends" | "groups";

type Recipient = {
  id: string;
  label: string;
  kind: "friend" | "group" | "saved";
};

const tabs: Array<{ id: PopupTab; label: string }> = [
  { id: "friends", label: "Friends" },
  { id: "add-friends", label: "Add Friends" },
  { id: "groups", label: "Groups" },
];

const canSelectFriend = (friend: FriendListItem) =>
  friend.presence !== "pending" && friend.presence !== "requested";

const buildHandle = (user: User) => `${user.username}#${user.id.slice(0, 4)}`;

const presenceCycle: FriendListItem["presence"][] = [
  "online",
  "offline",
  "online",
];

const buildFriendList = (
  currentUser: User,
  friends: User[]
): FriendListItem[] => {
  const savedContact: FriendListItem = {
    id: "saved",
    displayName: "Saved (you)",
    handle: "saved",
    presence: "online",
    avatarUrl: currentUser.avatarUrl,
    meta: "Private space",
    isSaved: true,
  };

  const list = friends.map((friend, index) => {
    const presence = presenceCycle[index % presenceCycle.length];
    return {
      id: friend.id,
      displayName: friend.displayName,
      handle: buildHandle(friend),
      presence,
      avatarUrl: friend.avatarUrl,
      lastSeen: presence === "offline" ? `${15 + index * 5}m ago` : undefined,
      meta: presence === "online" ? "Active now" : "Connected",
    };
  });

  return [savedContact, ...list];
};

const getOtherUserId = (request: FriendRequest, currentUserId: string) =>
  request.fromUser === currentUserId ? request.toUser : request.fromUser;

const truncate = (value: string, max = 64) =>
  value.length > max ? `${value.slice(0, max - 1)}…` : value;

const transformGroupMessages = (
  group: Group,
  messages: Message[],
  directory: Map<string, User>
): { summary: GroupSummary; messages: GroupMessage[] } => {
  if (!messages.length) {
    return {
      summary: {
        id: group.id,
        name: group.name,
        memberCount: group.members.length,
        latestActivity: "No activity yet",
        lastPostPreview: "No messages yet",
        avatarUrl: group.avatarUrl ?? undefined,
      },
      messages: [],
    };
  }

  const sortedAsc = messages
    .slice()
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  const latest = sortedAsc[sortedAsc.length - 1];

  const summary: GroupSummary = {
    id: group.id,
    name: group.name,
    memberCount: group.members.length,
    latestActivity: formatRelativeTime(latest.createdAt),
    lastPostPreview: truncate(latest.content),
    avatarUrl: group.avatarUrl ?? undefined,
  };

  const messageViews: GroupMessage[] = sortedAsc.map((message) => ({
    id: message.id,
    author: directory.get(message.fromUser)?.displayName ?? "Unknown person",
    timestamp: formatTimeOfDay(message.createdAt),
    content: message.content,
    type: message.type,
  }));

  return { summary, messages: messageViews };
};

const mapIncomingRequests = (
  requests: FriendRequestWithUser[],
  directory: Map<string, User>,
  currentUser: User
): IncomingRequest[] => {
  const myFriends = new Set(currentUser.friends);
  return requests.map(({ request, user }) => {
    const otherUser =
      user ?? directory.get(getOtherUserId(request, currentUser.id)) ?? null;
    const mutualCount =
      otherUser?.friends.filter((friendId: string) => myFriends.has(friendId))
        .length ?? 0;
    return {
      id: request.id,
      fromName: otherUser?.displayName ?? "Unknown user",
      message: "wants to connect",
      mutualCount,
    };
  });
};

const determinePotentialStatus = (
  userId: string,
  friends: Set<string>,
  incoming: Set<string>,
  outgoing: Set<string>
): PotentialFriend["status"] => {
  if (friends.has(userId)) return "connected";
  if (incoming.has(userId) || outgoing.has(userId)) return "pending";
  return "requested";
};

export const PopupApp = () => {
  const [activeTab, setActiveTab] = useState<PopupTab>("friends");
  const [searchTerm, setSearchTerm] = useState("");
  const [addFriendsSearchTerm, setAddFriendsSearchTerm] = useState("");
  const [note, setNote] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [friendUsers, setFriendUsers] = useState<User[]>([]);
  const [rawGroups, setRawGroups] = useState<Group[]>([]);
  const [groupSummaries, setGroupSummaries] = useState<GroupSummary[]>([]);
  const [messagesByGroup, setMessagesByGroup] = useState<
    Record<string, GroupMessage[]>
  >({});
  const [rawIncomingRequests, setRawIncomingRequests] = useState<
    FriendRequestWithUser[]
  >([]);
  const [rawOutgoingRequests, setRawOutgoingRequests] = useState<
    FriendRequestWithUser[]
  >([]);
  const [potentialMatches, setPotentialMatches] = useState<PotentialFriend[]>(
    []
  );
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [knownUsers, setKnownUsers] = useState<Record<string, User>>({});
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const selectedRecipientIds = useMemo(
    () => selectedRecipients.map((recipient) => recipient.id),
    [selectedRecipients]
  );

  const knownUsersMap = useMemo(() => {
    const map = new Map<string, User>();
    Object.values(knownUsers).forEach((user) => {
      map.set(user.id, user);
    });
    return map;
  }, [knownUsers]);

  const registerUsers = useCallback((users: User[]) => {
    setKnownUsers((prev) => {
      const next = { ...prev };
      let changed = false;
      users.forEach((user) => {
        if (user && !next[user.id]) {
          next[user.id] = user;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, []);

  const friendListItems = useMemo(
    () => (currentUser ? buildFriendList(currentUser, friendUsers) : []),
    [currentUser, friendUsers]
  );

  const filteredFriends = useMemo(
    () =>
      friendListItems.filter((friend) => {
        if (!searchTerm.trim()) return true;
        const normalized = searchTerm.toLowerCase();
        return (
          friend.displayName.toLowerCase().includes(normalized) ||
          friend.handle.toLowerCase().includes(normalized)
        );
      }),
    [friendListItems, searchTerm]
  );

  const incomingRequestSet = useMemo(() => {
    if (!currentUser) return new Set<string>();
    return new Set(
      rawIncomingRequests.map(({ request }) =>
        getOtherUserId(request, currentUser.id)
      )
    );
  }, [currentUser, rawIncomingRequests]);

  const outgoingRequestSet = useMemo(() => {
    if (!currentUser) return new Set<string>();
    return new Set(
      rawOutgoingRequests.map(({ request }) =>
        getOtherUserId(request, currentUser.id)
      )
    );
  }, [currentUser, rawOutgoingRequests]);

  const friendsSet = useMemo(
    () => new Set(friendUsers.map((friend) => friend.id)),
    [friendUsers]
  );

  const incomingRequests = useMemo<IncomingRequest[]>(() => {
    if (!currentUser) return [];
    return mapIncomingRequests(rawIncomingRequests, knownUsersMap, currentUser);
  }, [currentUser, knownUsersMap, rawIncomingRequests]);

  const searchRequestToken = useRef(0);
  const loadAbortRef = useRef<AbortController | null>(null);

  const handleToggleFriend = (friend: FriendListItem) => {
    if (!canSelectFriend(friend)) return;
    setSelectedRecipients((previous) => {
      const exists = previous.some((recipient) => recipient.id === friend.id);
      if (exists) {
        return previous.filter((recipient) => recipient.id !== friend.id);
      }

      return [
        ...previous,
        {
          id: friend.id,
          label: friend.displayName,
          kind: friend.isSaved ? "saved" : "friend",
        },
      ];
    });
  };

  const handleToggleGroupRecipient = (group: GroupSummary) => {
    setSelectedRecipients((previous) => {
      const exists = previous.some((recipient) => recipient.id === group.id);
      if (exists) {
        return previous.filter((recipient) => recipient.id !== group.id);
      }
      return [...previous, { id: group.id, label: group.name, kind: "group" }];
    });
  };

  const loadGroupMessages = useCallback(
    async (groupId: string) => {
      const group = rawGroups.find((entry) => entry.id === groupId);
      if (!group) return;
      setIsLoadingMessages(true);
      try {
        const { messages } = await api.getGroupMessages(groupId);
        const { summary, messages: viewMessages } = transformGroupMessages(
          group,
          messages,
          knownUsersMap
        );
        setMessagesByGroup((prev) => ({
          ...prev,
          [groupId]: viewMessages,
        }));
        setGroupSummaries((prev) =>
          prev.map((entry) =>
            entry.id === groupId ? { ...entry, ...summary } : entry
          )
        );
      } catch (err) {
        console.error("[popup] failed to load group messages", err);
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [knownUsersMap, rawGroups]
  );

  const handleRemoveRecipient = (id: string) => {
    setSelectedRecipients((previous) =>
      previous.filter((recipient) => recipient.id !== id)
    );
  };

  const handleSelectAllFriends = () => {
    const selectableFriends = filteredFriends.filter(canSelectFriend);
    setSelectedRecipients((previous) => {
      const next = [...previous];
      const existingIds = new Set(previous.map((recipient) => recipient.id));

      selectableFriends.forEach((friend) => {
        if (!existingIds.has(friend.id)) {
          next.push({
            id: friend.id,
            label: friend.displayName,
            kind: friend.isSaved ? "saved" : "friend",
          });
        }
      });

      return next;
    });
  };

  const handleClearSelection = () => {
    setSelectedRecipients([]);
  };

  const handleCreateGroupFromSelection = () => {
    console.info("[popup] create group from selection", selectedRecipients);
  };

  const getActiveTabUrl = useCallback(async (): Promise<string | null> => {
    if (typeof chrome !== "undefined" && chrome.tabs?.query) {
      return new Promise((resolve) => {
        try {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
            resolve(tabs?.[0]?.url ?? null)
          );
        } catch (err) {
          console.error("[popup] failed to query active tab", err);
          resolve(null);
        }
      });
    }

    if (typeof window !== "undefined" && window.location) {
      return window.location.href;
    }

    return null;
  }, []);

  const handleSelectGroup = useCallback(
    (groupId: string) => {
      setSelectedGroupId(groupId);
      if (!messagesByGroup[groupId]) {
        void loadGroupMessages(groupId);
      }
    },
    [loadGroupMessages, messagesByGroup]
  );

  const handleSearchUsers = useCallback(async () => {
    const query = addFriendsSearchTerm.trim();
    if (!currentUser || !query.length) {
      setPotentialMatches([]);
      return;
    }

    const token = Date.now();
    searchRequestToken.current = token;
    setIsSearching(true);

    try {
      const { users } = await api.searchUsers(query, 12);
      if (searchRequestToken.current !== token) return;
      registerUsers(users);
      const next = users
        .filter((user) => user.id !== currentUser.id)
        .map<PotentialFriend>((user) => ({
          id: user.id,
          displayName: user.displayName,
          handle: buildHandle(user),
          status: determinePotentialStatus(
            user.id,
            friendsSet,
            incomingRequestSet,
            outgoingRequestSet
          ),
          avatarUrl: user.avatarUrl ?? undefined,
        }));
      setPotentialMatches(next);
    } catch (err) {
      if (searchRequestToken.current !== token) return;
      console.error("[popup] user search failed", err);
    } finally {
      if (searchRequestToken.current === token) {
        setIsSearching(false);
      }
    }
  }, [
    addFriendsSearchTerm,
    currentUser,
    friendsSet,
    incomingRequestSet,
    outgoingRequestSet,
    registerUsers,
  ]);

  useEffect(() => {
    if (!addFriendsSearchTerm.trim()) {
      setPotentialMatches([]);
      setIsSearching(false);
    }
  }, [addFriendsSearchTerm]);

  const loadData = useCallback(async () => {
    loadAbortRef.current?.abort();
    const controller = new AbortController();
    loadAbortRef.current = controller;

    setIsLoading(true);
    setError(null);
    setIsLoadingMessages(false);

    try {
      const [meRes, friendsRes, requestsRes, groupsRes] = await Promise.all([
        api.getCurrentUser(),
        api.getFriends(),
        api.getFriendRequests(),
        api.getGroups(),
      ]);

      if (controller.signal.aborted) return;

      const me = meRes.user;
      setCurrentUser(me);
      setFriendUsers(friendsRes.friends);
      setRawIncomingRequests(requestsRes.incoming);
      setRawOutgoingRequests(requestsRes.outgoing);
      setRawGroups(groupsRes.groups);

      const directory = new Map<string, User>();
      directory.set(me.id, me);
      friendsRes.friends.forEach((friend) => directory.set(friend.id, friend));
      requestsRes.incoming.forEach(({ user }) => {
        if (user) directory.set(user.id, user);
      });
      requestsRes.outgoing.forEach(({ user }) => {
        if (user) directory.set(user.id, user);
      });

      registerUsers(Array.from(directory.values()));

      const initialSummaries: GroupSummary[] = groupsRes.groups.map(
        (group) => ({
          id: group.id,
          name: group.name,
          memberCount: group.members.length,
          latestActivity: "Loading…",
          lastPostPreview: "Fetching latest activity…",
          avatarUrl: group.avatarUrl ?? undefined,
        })
      );
      setGroupSummaries(initialSummaries);
      setMessagesByGroup({});
      setSelectedGroupId(
        (current) => current ?? initialSummaries[0]?.id ?? null
      );

      if (groupsRes.groups.length > 0) {
        setIsLoadingMessages(true);
        const messagePayloads = await Promise.all(
          groupsRes.groups.map(async (group) => {
            const { messages } = await api.getGroupMessages(group.id);
            return { group, messages };
          })
        );

        if (controller.signal.aborted) return;

        const messagesRecord: Record<string, GroupMessage[]> = {};
        const summaries: GroupSummary[] = messagePayloads.map(
          ({ group, messages }) => {
            const { summary, messages: viewMessages } = transformGroupMessages(
              group,
              messages,
              directory
            );
            messagesRecord[group.id] = viewMessages;
            return summary;
          }
        );

        setMessagesByGroup(messagesRecord);
        setGroupSummaries(summaries);
      }

      setIsLoadingMessages(false);
    } catch (err) {
      if (controller.signal.aborted) return;
      const message =
        err instanceof ApiError ? err.message : "Failed to load data";
      setError(message);
      console.error("[popup] failed to load popup data", err);
      setIsLoadingMessages(false);
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [registerUsers]);

  useEffect(() => {
    void loadData();
    return () => {
      loadAbortRef.current?.abort();
    };
  }, [loadData]);

  const handleSend = useCallback(async () => {
    if (!selectedRecipients.length) {
      setSendError("Select at least one recipient before sending.");
      return;
    }

    setIsSending(true);
    setSendError(null);

    try {
      const activeUrl = await getActiveTabUrl();
      const trimmedNote = note.trim();
      const hasUrl = typeof activeUrl === "string" && activeUrl.length > 0;

      const content = hasUrl
        ? activeUrl
        : trimmedNote.length
        ? trimmedNote
        : "Shared via Shoot";
      const type = hasUrl ? "link" : "text";
      const noteValue = hasUrl && trimmedNote.length ? trimmedNote : undefined;

      for (const recipient of selectedRecipients) {
        if (recipient.kind === "group") {
          await api.sendMessage({
            targetType: "group",
            targetId: recipient.id,
            content,
            note: noteValue,
            type,
          });
        } else if (recipient.kind === "saved") {
          await api.sendMessage({
            targetType: "saved",
            content,
            note: noteValue,
            type,
          });
        } else {
          await api.sendMessage({
            targetType: "user",
            targetId: recipient.id,
            content,
            note: noteValue,
            type,
          });
        }
      }

      setNote("");
      void loadData();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to send message.";
      setSendError(message);
      console.error("[popup] failed to send message", err);
    } finally {
      setIsSending(false);
    }
  }, [selectedRecipients, getActiveTabUrl, note, loadData]);

  const renderActiveTab = () => {
    if (isLoading) {
      return (
        <div className="flex h-full items-center justify-center text-sm text-white/70">
          Loading data…
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-glass-sm text-center">
          <p className="text-sm font-semibold text-white">{error}</p>
          <Button size="sm" variant="secondary" onClick={() => void loadData()}>
            Retry
          </Button>
        </div>
      );
    }

    switch (activeTab) {
      case "friends":
        return (
          <FriendsTab
            friends={friendListItems}
            searchTerm={searchTerm}
            selectedRecipientIds={selectedRecipientIds}
            onToggleRecipient={handleToggleFriend}
            onSelectAll={handleSelectAllFriends}
            onClearSelection={handleClearSelection}
            onCreateGroupFromSelection={handleCreateGroupFromSelection}
          />
        );
      case "add-friends":
        return (
          <AddFriendsTab
            searchTerm={addFriendsSearchTerm}
            onSearchTermChange={setAddFriendsSearchTerm}
            potentialMatches={potentialMatches}
            incomingRequests={incomingRequests}
            onSearch={handleSearchUsers}
            isSearching={isSearching}
          />
        );
      case "groups":
        return (
          <GroupsTab
            groups={groupSummaries}
            messagesByGroup={messagesByGroup}
            selectedGroupId={selectedGroupId}
            onSelectGroup={handleSelectGroup}
            selectedRecipientIds={selectedRecipientIds}
            onToggleRecipient={handleToggleGroupRecipient}
            isLoadingMessages={isLoadingMessages}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative flex h-[640px] w-[420px] flex-col gap-glass rounded-glass-lg border border-white/15 bg-white/12 p-glass-xl text-white shadow-glass backdrop-blur-glass">
      <header className="flex items-center gap-glass-sm rounded-glass border border-white/20 bg-white/15 px-glass-md py-glass-sm shadow-glass-soft backdrop-blur-glass">
        <div className="flex flex-1 items-center gap-glass-sm rounded-pill border border-white/20 bg-white/25 px-glass-sm py-glass-sm shadow-glass-soft backdrop-blur-glass">
          <Search className="h-4 w-4 text-white/80" aria-hidden />
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search"
            className="border-none px-0 shadow-none text-sm text-white placeholder:text-white/60 focus:ring-0 focus-visible:ring-0"
          />
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="h-10 w-10 rounded-pill bg-white/25 text-white shadow-glass-soft backdrop-blur-glass"
        >
          <Settings className="h-5 w-5" aria-hidden />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 rounded-pill border border-white/20 bg-transparent text-white"
        >
          <X className="h-5 w-5" aria-hidden />
        </Button>
      </header>

      <nav className="grid grid-cols-3 gap-glass-sm rounded-pill border border-white/15 bg-white/10 p-[6px] shadow-glass-soft backdrop-blur-glass">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-pill px-glass-sm py-glass-sm text-sm font-semibold text-white/75 transition hover:-translate-y-0.5 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glass-accent/40",
              activeTab === tab.id &&
                "bg-[linear-gradient(135deg,rgba(96,165,250,0.35),rgba(165,180,252,0.3))] text-white shadow-glass"
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="flex flex-1 flex-col rounded-glass border border-white/15 bg-white/15 p-glass shadow-glass backdrop-blur-glass">
        {renderActiveTab()}
      </main>

      <section className="space-y-glass-sm rounded-glass border border-white/15 bg-white/12 p-glass shadow-glass backdrop-blur-glass">
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-white/90">Message / Note</span>
          <textarea
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Add a short note (optional)"
            className="rounded-glass border border-white/25 bg-white/18 px-glass-sm py-glass-sm text-sm text-white shadow-glass-soft backdrop-blur-glass placeholder:text-white/55 focus:border-white focus:outline-none focus:ring-2 focus:ring-glass-accent/40 focus:ring-offset-2 focus:ring-offset-white/10"
          />
        </label>
        <div className="flex flex-wrap items-center gap-glass-sm">
          <MessageSquare className="h-4 w-4 text-white/80" aria-hidden />
          <span className="text-xs font-semibold uppercase text-white/70">
            Selected:
          </span>
          {selectedRecipients.length ? (
            selectedRecipients.map((recipient) => (
              <RecipientChip
                key={recipient.id}
                label={recipient.label}
                onRemove={() => handleRemoveRecipient(recipient.id)}
              />
            ))
          ) : (
            <span className="text-xs text-white/60">No recipients yet.</span>
          )}
        </div>
        {sendError ? (
          <p className="text-xs font-semibold text-[#fca5a5]">{sendError}</p>
        ) : null}
        <Button
          className="w-full"
          size="lg"
          onClick={() => void handleSend()}
          disabled={!selectedRecipients.length || isSending}
        >
          <Send className="h-4 w-4" />
          {isSending ? "Sending…" : "Send ▶︎"}
        </Button>
      </section>
    </div>
  );
};
