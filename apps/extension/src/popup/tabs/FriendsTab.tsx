import { Fragment } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { FriendListItem } from "@/features/popup/types";

const presenceMeta: Record<
  FriendListItem["presence"],
  { label: string; badgeVariant: "neutral" | "success" | "warning" }
> = {
  online: { label: "Online", badgeVariant: "success" },
  offline: { label: "Offline", badgeVariant: "neutral" },
  pending: { label: "Pending", badgeVariant: "warning" },
  requested: { label: "Requested", badgeVariant: "warning" },
};

export interface FriendsTabProps {
  friends: FriendListItem[];
  searchTerm: string;
  selectedRecipientIds: string[];
  onToggleRecipient: (friend: FriendListItem) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onCreateGroupFromSelection: () => void;
}

export const FriendsTab = ({
  friends,
  searchTerm,
  selectedRecipientIds,
  onToggleRecipient,
  onSelectAll,
  onClearSelection,
  onCreateGroupFromSelection,
}: FriendsTabProps) => {
  const normalizedQuery = searchTerm.trim().toLowerCase();
  const filteredFriends = normalizedQuery.length
    ? friends.filter(
        (friend) =>
          friend.displayName.toLowerCase().includes(normalizedQuery) ||
          friend.handle.toLowerCase().includes(normalizedQuery)
      )
    : friends;

  if (!filteredFriends.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-brutal-navy bg-white px-6 py-10 text-center text-sm text-brutal-navy shadow-brutal-sm">
        <p className="font-semibold">No friends match “{searchTerm}”.</p>
        <p className="mt-2 text-xs text-brutal-navy/70">
          Try searching by handle or invite someone new.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ul className="flex-1 space-y-3 overflow-y-auto pr-1">
        {filteredFriends.map((friend) => {
          const presence = presenceMeta[friend.presence];
          const isDisabled =
            friend.presence === "pending" || friend.presence === "requested";
          const isSelected = selectedRecipientIds.includes(friend.id);

          return (
            <li key={friend.id}>
              <label
                className="flex cursor-pointer items-center gap-4 rounded-3xl border-2 border-brutal-navy bg-white p-4 shadow-brutal-sm transition hover:-translate-y-0.5 hover:shadow-brutal focus-within:border-brutal-navy/80"
                aria-disabled={isDisabled}
              >
                <Checkbox
                  checked={isSelected}
                  onChange={() => onToggleRecipient(friend)}
                  disabled={isDisabled}
                  aria-label={`Select ${friend.displayName}`}
                />
                <Avatar
                  name={friend.displayName}
                  src={friend.avatarUrl}
                  status={
                    friend.presence === "online"
                      ? "online"
                      : friend.presence === "pending"
                      ? "pending"
                      : undefined
                  }
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-brutal-navy">
                      {friend.displayName}
                    </p>
                    {friend.isSaved ? (
                      <Badge variant="info" className="uppercase">
                        Saved
                      </Badge>
                    ) : (
                      <Badge variant={presence.badgeVariant}>
                        {presence.label}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-brutal-navy/70">
                    <span>{friend.handle}</span>
                    {friend.lastSeen ? (
                      <Fragment>
                        <span aria-hidden>•</span>
                        <span>Last seen {friend.lastSeen}</span>
                      </Fragment>
                    ) : null}
                    {friend.meta ? (
                      <Fragment>
                        <span aria-hidden>•</span>
                        <span>{friend.meta}</span>
                      </Fragment>
                    ) : null}
                  </div>
                </div>
              </label>
            </li>
          );
        })}
      </ul>
      <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-3xl border-2 border-brutal-navy bg-brutal-blue/20 p-4 shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-3 text-xs"
            onClick={onSelectAll}
          >
            Select All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-3 text-xs"
            onClick={onClearSelection}
          >
            Clear
          </Button>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="h-9 px-3 text-xs"
          onClick={onCreateGroupFromSelection}
          disabled={selectedRecipientIds.length < 2}
        >
          Create Group from selection
        </Button>
      </footer>
    </div>
  );
};
