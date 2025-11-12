import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { GroupMessage, GroupSummary } from "@/mocks/popup-data";

export interface GroupsTabProps {
  groups: GroupSummary[];
  messagesByGroup: Record<string, GroupMessage[]>;
  selectedGroupId: string | null;
  selectedRecipientIds: string[];
  onSelectGroup: (groupId: string) => void;
  onToggleRecipient: (group: GroupSummary) => void;
}

export const GroupsTab = ({
  groups,
  messagesByGroup,
  selectedGroupId,
  selectedRecipientIds,
  onSelectGroup,
  onToggleRecipient,
}: GroupsTabProps) => {
  const activeGroup =
    selectedGroupId !== null
      ? groups.find((group) => group.id === selectedGroupId) ?? null
      : groups[0] ?? null;

  const groupMessages = activeGroup
    ? messagesByGroup[activeGroup.id] ?? []
    : [];

  return (
    <div className="flex h-full flex-col gap-3">
      <header className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink-900">Groups</h3>
        <Button variant="secondary" size="sm" className="h-9 px-3 text-xs">
          Create Group +
        </Button>
      </header>
      <div className="grid gap-3 md:grid-cols-2">
        <aside className="space-y-2 overflow-y-auto pr-1">
          {groups.map((group) => {
            const isActive = activeGroup?.id === group.id;
            const isSelected = selectedRecipientIds.includes(group.id);

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => onSelectGroup(group.id)}
                className="w-full rounded-2xl border border-ink-200 bg-white p-3 text-left transition hover:border-primary-200 hover:bg-primary-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-ink-900">
                      {group.name}
                    </p>
                    <p className="text-xs text-ink-500">
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
                <p className="mt-2 line-clamp-2 text-xs text-ink-500">
                  {group.lastPostPreview}
                </p>
                <p className="mt-1 text-xs text-ink-400">
                  Latest: {group.latestActivity}
                </p>
                {isActive ? (
                  <span className="mt-2 inline-block rounded-full bg-primary-100 px-2 py-1 text-[10px] font-medium uppercase text-primary-700">
                    Viewing
                  </span>
                ) : null}
              </button>
            );
          })}
        </aside>

        <section className="flex min-h-[260px] flex-col rounded-2xl bg-white p-4 shadow-soft">
          {activeGroup ? (
            <>
              <header className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink-900">
                    {activeGroup.name}
                  </p>
                  <p className="text-xs text-ink-500">
                    {activeGroup.memberCount} members • Latest{" "}
                    {activeGroup.latestActivity}
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
                  Settings
                </Button>
              </header>
              <div className="mt-3 flex-1 space-y-3 overflow-y-auto pr-1">
                {groupMessages.length ? (
                  groupMessages.map((message) => (
                    <article
                      key={message.id}
                      className="rounded-xl bg-ink-50 p-3"
                    >
                      <div className="flex items-center gap-2 text-xs text-ink-500">
                        <span className="font-medium text-ink-800">
                          {message.author}
                        </span>
                        <span aria-hidden>•</span>
                        <span>{message.timestamp}</span>
                      </div>
                      <p className="mt-2 break-words text-sm text-ink-900">
                        {message.content}
                      </p>
                    </article>
                  ))
                ) : (
                  <p className="text-sm text-ink-500">
                    No messages yet. Start the conversation!
                  </p>
                )}
              </div>
              <footer className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Message field"
                  className="h-10 flex-1 rounded-xl border border-ink-200 px-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
                <Button size="sm" className="h-10 px-4 text-xs">
                  Send ▶︎
                </Button>
              </footer>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-ink-500">
              Select a group to view activity.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
