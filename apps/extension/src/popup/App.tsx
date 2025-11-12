import { useMemo, useState } from "react";

import { MessageSquare, Search, Send, Settings, X } from "lucide-react";

import { RecipientChip } from "@/components/recipient-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import {
  defaultSelectedGroupId,
  mockFriends,
  mockGroupMessages,
  mockGroups,
  mockIncomingRequests,
  mockPotentialFriends,
  type FriendListItem,
  type GroupSummary,
} from "@/mocks/popup-data";
import { AddFriendsTab } from "@/popup/tabs/AddFriendsTab";
import { FriendsTab } from "@/popup/tabs/FriendsTab";
import { GroupsTab } from "@/popup/tabs/GroupsTab";

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

export const PopupApp = () => {
  const [activeTab, setActiveTab] = useState<PopupTab>("friends");
  const [searchTerm, setSearchTerm] = useState("");
  const [note, setNote] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(
    defaultSelectedGroupId
  );

  const selectedRecipientIds = useMemo(
    () => selectedRecipients.map((recipient) => recipient.id),
    [selectedRecipients]
  );
  const filteredFriends = useMemo(
    () =>
      mockFriends.filter((friend) => {
        if (!searchTerm.trim()) return true;
        const normalized = searchTerm.toLowerCase();
        return (
          friend.displayName.toLowerCase().includes(normalized) ||
          friend.handle.toLowerCase().includes(normalized)
        );
      }),
    [searchTerm]
  );

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

  const handleSend = () => {
    console.info("[popup] send link", {
      recipients: selectedRecipients,
      note: note.trim(),
    });
    setNote("");
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "friends":
        return (
          <FriendsTab
            friends={mockFriends}
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
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            potentialMatches={mockPotentialFriends}
            incomingRequests={mockIncomingRequests}
          />
        );
      case "groups":
        return (
          <GroupsTab
            groups={mockGroups}
            messagesByGroup={mockGroupMessages}
            selectedGroupId={selectedGroupId}
            onSelectGroup={setSelectedGroupId}
            selectedRecipientIds={selectedRecipientIds}
            onToggleRecipient={handleToggleGroupRecipient}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-[640px] w-[420px] flex-col gap-3 bg-ink-100/80 p-4 text-ink-900">
      <header className="flex items-center gap-3 rounded-2.5xl bg-white p-3 shadow-soft">
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-ink-200 pl-3 pr-2">
          <Search className="h-4 w-4 text-ink-400" aria-hidden />
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search"
            className="border-0 px-0 focus:ring-0"
          />
        </div>
        <Button variant="ghost" size="sm" className="h-10 w-10 rounded-2xl">
          <Settings className="h-5 w-5" aria-hidden />
        </Button>
        <Button variant="ghost" size="sm" className="h-10 w-10 rounded-2xl">
          <X className="h-5 w-5" aria-hidden />
        </Button>
      </header>

      <nav className="grid grid-cols-3 gap-2 rounded-2xl bg-white p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-2xl px-3 py-2 text-sm font-semibold text-ink-500 transition hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300",
              activeTab === tab.id &&
                "bg-primary-100 text-primary-700 shadow-soft"
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="flex flex-1 flex-col rounded-2.5xl bg-white p-4 shadow-soft">
        {renderActiveTab()}
      </main>

      <section className="space-y-3 rounded-2.5xl bg-white p-4 shadow-soft">
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-ink-700">Message / Note</span>
          <textarea
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Add a short note (optional)"
            className="rounded-2xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <MessageSquare className="h-4 w-4 text-ink-400" aria-hidden />
          <span className="text-xs text-ink-500">Selected:</span>
          {selectedRecipients.length ? (
            selectedRecipients.map((recipient) => (
              <RecipientChip
                key={recipient.id}
                label={recipient.label}
                onRemove={() => handleRemoveRecipient(recipient.id)}
              />
            ))
          ) : (
            <span className="text-xs text-ink-400">No recipients yet.</span>
          )}
        </div>
        <Button
          className="w-full"
          size="lg"
          onClick={handleSend}
          disabled={!selectedRecipients.length}
        >
          <Send className="h-4 w-4" />
          Send ▶︎
        </Button>
      </section>
    </div>
  );
};
