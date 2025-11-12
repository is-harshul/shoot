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
    <div className="flex h-full flex-col gap-4">
      <header className="flex items-center justify-between rounded-3xl border-2 border-brutal-navy bg-brutal-pink/30 px-4 py-3 shadow-brutal-sm">
        <h3 className="text-base font-semibold text-brutal-navy">Groups</h3>
        <Button variant="secondary" size="sm" className="h-9 px-4 text-xs">
          Create Group +
        </Button>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <aside className="space-y-3 overflow-y-auto pr-1">
          {groups.map((group) => {
            const isActive = activeGroup?.id === group.id;
            const isSelected = selectedRecipientIds.includes(group.id);

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => onSelectGroup(group.id)}
                className="w-full rounded-3xl border-2 border-brutal-navy bg-brutal-cream p-4 text-left shadow-brutal-sm transition hover:-translate-y-0.5 hover:shadow-brutal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brutal-blue/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-brutal-navy">
                      {group.name}
                    </p>
                    <p className="text-xs text-brutal-navy/70">
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
                <p className="mt-2 line-clamp-2 text-xs text-brutal-navy/80">
                  {group.lastPostPreview}
                </p>
                <p className="mt-1 text-xs text-brutal-navy/60">
                  Latest: {group.latestActivity}
                </p>
                {isActive ? (
                  <span className="mt-3 inline-block rounded-full border-2 border-brutal-navy bg-brutal-yellow px-3 py-1 text-[10px] font-semibold uppercase text-brutal-navy shadow-brutal-sm">
                    Viewing
                  </span>
                ) : null}
              </button>
            );
          })}
        </aside>

        <section className="flex min-h-[260px] flex-col rounded-3xl border-2 border-brutal-navy bg-white p-6 shadow-brutal">
          {activeGroup ? (
            <>
              <header className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-brutal-navy">
                    {activeGroup.name}
                  </p>
                  <p className="text-xs text-brutal-navy/70">
                    {activeGroup.memberCount} members • Latest{" "}
                    {activeGroup.latestActivity}
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="h-9 px-3 text-xs">
                  Settings
                </Button>
              </header>
              <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
                {isLoadingMessages && !groupMessages.length ? (
                  <p className="text-sm text-brutal-navy/70">
                    Loading latest messages…
                  </p>
                ) : groupMessages.length ? (
                  groupMessages.map((message) => (
                    <article
                      key={message.id}
                      className="rounded-3xl border-2 border-brutal-navy bg-brutal-blue/20 p-4 shadow-brutal-sm"
                    >
                      <div className="flex items-center gap-2 text-xs text-brutal-navy/70">
                        <span className="font-semibold text-brutal-navy">
                          {message.author}
                        </span>
                        <span aria-hidden>•</span>
                        <span>{message.timestamp}</span>
                      </div>
                      <p className="mt-2 break-words text-sm font-medium text-brutal-navy">
                        {message.content}
                      </p>
                    </article>
                  ))
                ) : (
                  <p className="text-sm text-brutal-navy/70">
                    No messages yet. Start the conversation!
                  </p>
                )}
              </div>
              <footer className="mt-4 flex items-center gap-3">
                <Input placeholder="Message field" className="flex-1" />
                <Button size="sm" className="h-10 px-4 text-xs">
                  Send ▶︎
                </Button>
              </footer>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-brutal-navy bg-brutal-blue/10 text-sm text-brutal-navy/80">
              Select a group to view activity.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
