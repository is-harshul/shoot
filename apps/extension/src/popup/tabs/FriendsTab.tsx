import { Fragment } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { FriendListItem } from "@/mocks/popup-data";

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
      <div className="flex flex-col items-center justify-center py-10 text-center text-sm text-ink-500">
        <p>No friends match “{searchTerm}”.</p>
        <p className="mt-1">Try searching by handle or invite someone new.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ul className="flex-1 space-y-2 overflow-y-auto pr-1">
        {filteredFriends.map((friend) => {
          const presence = presenceMeta[friend.presence];
          const isDisabled =
            friend.presence === "pending" || friend.presence === "requested";
          const isSelected = selectedRecipientIds.includes(friend.id);

          return (
            <li key={friend.id}>
              <label
                className="flex cursor-pointer items-center gap-3 rounded-2xl border border-transparent bg-white p-3 transition hover:border-primary-200 hover:bg-primary-50/40 focus-within:border-primary-300"
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
                    <p className="truncate text-sm font-semibold text-ink-900">
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
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-500">
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
      <footer className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white p-3 shadow-soft">
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
