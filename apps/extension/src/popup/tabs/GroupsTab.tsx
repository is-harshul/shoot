import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { GroupMessage, GroupSummary } from "@/features/popup/types";
import { cn } from "@/lib/cn";

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
    <div className="flex h-full flex-col gap-5">
      <header className="glass-panel-sm flex items-center justify-between bg-white/[0.12]">
        <h3 className="text-base font-semibold text-white">Groups</h3>
        <Button variant="secondary" size="sm">
          Create Group +
        </Button>
      </header>
      <div className="grid gap-5 md:grid-cols-2">
        <aside className="thin-scrollbar space-y-3 overflow-y-auto pr-1 scroll-smooth-touch">
          {groups.map((group) => {
            const isActive = activeGroup?.id === group.id;
            const isSelected = selectedRecipientIds.includes(group.id);

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => onSelectGroup(group.id)}
                className={cn(
                  "glass-card w-full text-left",
                  isActive && "border-white/35 bg-white/20 shadow-glass",
                  isSelected && "ring-1 ring-glass-accent/60"
                )}
              >
                <div className="flex items-start justify-between gap-4">
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
                <p className="mt-2 line-clamp-2 text-xs text-white/75">
                  {group.lastPostPreview}
                </p>
                <p className="mt-[6px] text-xs text-white/60">
                  Latest: {group.latestActivity}
                </p>
                {isActive ? (
                  <span className="mt-3 inline-block rounded-full border border-white/20 bg-white/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
                    Viewing
                  </span>
                ) : null}
              </button>
            );
          })}
        </aside>

        <section className="glass-panel flex min-h-[260px] flex-col gap-4">
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
                <Button variant="ghost" size="sm">
                  Settings
                </Button>
              </header>
              <div className="thin-scrollbar flex-1 space-y-3 overflow-y-auto pr-1 scroll-smooth-touch">
                {isLoadingMessages && !groupMessages.length ? (
                  <p className="text-sm text-white/70">
                    Loading latest messages…
                  </p>
                ) : groupMessages.length ? (
                  groupMessages.map((message) => (
                    <article key={message.id} className="glass-card space-y-2">
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
              <footer className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <Input
                  placeholder="Message field"
                  className="flex-1 border-white/15 bg-white/8"
                />
                <Button size="sm">Send ▶︎</Button>
              </footer>
            </>
          ) : (
            <div className="glass-panel-sm flex flex-1 items-center justify-center border border-dashed border-white/25 bg-white/8 text-sm text-white/70">
              Select a group to view activity.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
