import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { GroupMessage, GroupSummary } from "@/features/popup/types";

export interface GroupsTabProps {
  groups: GroupSummary[];
  messagesByGroup: Record<string, GroupMessage[]>;
  selectedGroupId: string | null;
  selectedRecipientIds: string[];
  onSelectGroup: (groupId: string) => void;
  onToggleRecipient: (group: GroupSummary) => void;
  isLoadingMessages: boolean;
}

export const GroupsTab = ({
  groups,
  messagesByGroup,
  selectedGroupId,
  selectedRecipientIds,
  onSelectGroup,
  onToggleRecipient,
  isLoadingMessages,
}: GroupsTabProps) => {
  const activeGroup =
    selectedGroupId !== null
      ? groups.find((group) => group.id === selectedGroupId) ?? null
      : groups[0] ?? null;

  const groupMessages = activeGroup
    ? messagesByGroup[activeGroup.id] ?? []
    : [];

  return (
    <div className="flex h-full flex-col gap-glass">
      <header className="flex items-center justify-between rounded-glass border border-white/20 bg-white/18 px-glass py-glass-sm shadow-glass-soft backdrop-blur-glass">
        <h3 className="text-base font-semibold text-white">Groups</h3>
        <Button
          variant="secondary"
          size="sm"
          className="h-9 px-glass-sm text-xs"
        >
          Create Group +
        </Button>
      </header>
      <div className="grid gap-glass md:grid-cols-2">
        <aside className="space-y-glass-sm overflow-y-auto pr-1">
          {groups.map((group) => {
            const isActive = activeGroup?.id === group.id;
            const isSelected = selectedRecipientIds.includes(group.id);

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => onSelectGroup(group.id)}
                className="w-full rounded-glass border border-white/20 bg-white/18 px-glass py-glass-sm text-left shadow-glass-soft backdrop-blur-glass transition hover:-translate-y-0.5 hover:bg-white/25 hover:shadow-glass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glass-accent/40"
              >
                <div className="flex items-start justify-between gap-glass-sm">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {group.name}
                    </p>
                    <p className="text-xs text-white/70">
                      {group.memberCount} members
                    </p>
                  </div>
                  <Checkbox
                    checked={isSelected}
                    onChange={(event) => {
                      event.stopPropagation();
                      onToggleRecipient(group);
                    }}
                    aria-label={`Select group ${group.name}`}
                  />
                </div>
                <p className="mt-glass-sm line-clamp-2 text-xs text-white/75">
                  {group.lastPostPreview}
                </p>
                <p className="mt-[6px] text-xs text-white/60">
                  Latest: {group.latestActivity}
                </p>
                {isActive ? (
                  <span className="mt-glass-sm inline-block rounded-pill border border-white/20 bg-white/30 px-glass-sm py-[4px] text-[10px] font-semibold uppercase text-white/80">
                    Viewing
                  </span>
                ) : null}
              </button>
            );
          })}
        </aside>

        <section className="flex min-h-[260px] flex-col rounded-glass border border-white/15 bg-white/18 p-glass shadow-glass backdrop-blur-glass">
          {activeGroup ? (
            <>
              <header className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-white">
                    {activeGroup.name}
                  </p>
                  <p className="text-xs text-white/70">
                    {activeGroup.memberCount} members • Latest{" "}
                    {activeGroup.latestActivity}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-glass-sm text-xs"
                >
                  Settings
                </Button>
              </header>
              <div className="mt-glass-sm flex-1 space-y-glass-sm overflow-y-auto pr-1">
                {isLoadingMessages && !groupMessages.length ? (
                  <p className="text-sm text-white/70">
                    Loading latest messages…
                  </p>
                ) : groupMessages.length ? (
                  groupMessages.map((message) => (
                    <article
                      key={message.id}
                      className="rounded-glass border border-white/20 bg-white/18 px-glass py-glass-sm shadow-glass-soft backdrop-blur-glass"
                    >
                      <div className="flex items-center gap-2 text-xs text-white/70">
                        <span className="font-semibold text-white">
                          {message.author}
                        </span>
                        <span aria-hidden>•</span>
                        <span>{message.timestamp}</span>
                      </div>
                      <p className="mt-2 break-words text-sm font-medium text-white">
                        {message.content}
                      </p>
                    </article>
                  ))
                ) : (
                  <p className="text-sm text-white/70">
                    No messages yet. Start the conversation!
                  </p>
                )}
              </div>
              <footer className="mt-glass-sm flex items-center gap-glass-sm">
                <Input placeholder="Message field" className="flex-1" />
                <Button size="sm" className="h-10 px-glass-sm text-xs">
                  Send ▶︎
                </Button>
              </footer>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center rounded-glass border border-dashed border-white/20 bg-white/12 px-glass-md py-glass-sm text-sm text-white/70">
              Select a group to view activity.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
