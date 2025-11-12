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
      <div className="flex flex-col items-center justify-center rounded-glass border border-white/25 bg-white/20 px-glass-lg py-glass-xl text-center text-sm text-white shadow-glass-soft backdrop-blur-glass">
        <p className="font-semibold">No friends match “{searchTerm}”.</p>
        <p className="mt-2 text-xs text-white/70">
          Try searching by handle or invite someone new.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ul className="flex-1 list-none space-y-glass-sm overflow-y-auto pr-1">
        {filteredFriends.map((friend) => {
          const presence = presenceMeta[friend.presence];
          const isDisabled =
            friend.presence === "pending" || friend.presence === "requested";
          const isSelected = selectedRecipientIds.includes(friend.id);

          return (
            <li key={friend.id}>
              <label
                className="flex cursor-pointer items-center gap-glass rounded-glass border border-white/25 bg-white/18 px-glass-sm py-glass-sm shadow-glass-soft backdrop-blur-glass transition hover:-translate-y-0.5 hover:bg-white/30 hover:shadow-glass focus-within:border-white/40"
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
                    <p className="truncate text-sm font-semibold text-white">
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
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/70">
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
      <footer className="mt-glass-sm flex flex-wrap items-center justify-between gap-glass-sm rounded-glass border border-white/20 bg-white/15 p-glass-sm shadow-glass-soft backdrop-blur-glass">
        <div className="flex items-center gap-glass-sm">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-glass-sm text-xs"
            onClick={onSelectAll}
          >
            Select All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-glass-sm text-xs"
            onClick={onClearSelection}
          >
            Clear
          </Button>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="h-9 px-glass-sm text-xs"
          onClick={onCreateGroupFromSelection}
          disabled={selectedRecipientIds.length < 2}
        >
          Create Group from selection
        </Button>
      </footer>
    </div>
  );
};
