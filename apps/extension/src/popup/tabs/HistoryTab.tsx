import { useMemo, useState } from "react";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Link2,
  MessageSquareText,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type {
  HistoryMessage,
  HistoryMessageDirection,
} from "@/features/popup/types";
import { cn } from "@/lib/cn";

const historyFilters: Array<{
  id: HistoryMessageDirection;
  label: string;
  description: string;
}> = [
  {
    id: "sent",
    label: "Sent",
    description: "Everything you've shared recently.",
  },
  {
    id: "received",
    label: "Received",
    description: "Links and notes shared with you.",
  },
];

const directionMeta: Record<
  HistoryMessageDirection,
  { label: string; icon: typeof ArrowUpRight; badgeVariant: "info" | "neutral" }
> = {
  sent: {
    label: "Sent",
    icon: ArrowUpRight,
    badgeVariant: "info",
  },
  received: {
    label: "Received",
    icon: ArrowDownLeft,
    badgeVariant: "neutral",
  },
};

const kindLabels: Record<HistoryMessage["counterpartKind"], string> = {
  user: "Friend",
  group: "Group",
  saved: "Saved",
};

export interface HistoryTabProps {
  sentMessages: HistoryMessage[];
  receivedMessages: HistoryMessage[];
}

export const HistoryTab = ({
  sentMessages,
  receivedMessages,
}: HistoryTabProps) => {
  const [activeFilter, setActiveFilter] =
    useState<HistoryMessageDirection>("sent");

  const { label: filterLabel, description: filterDescription } = useMemo(
    () =>
      historyFilters.find((filter) => filter.id === activeFilter) ??
      historyFilters[0],
    [activeFilter]
  );

  const visibleMessages =
    activeFilter === "sent" ? sentMessages : receivedMessages;

  return (
    <div className="flex h-full flex-col gap-5">
      <header className="glass-panel-sm flex flex-col gap-4 bg-white/[0.12] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="section-title">Recent activity</p>
          <h3 className="text-lg font-semibold text-white">
            {filterLabel} messages
          </h3>
          <p className="mt-1 text-xs text-white/65">{filterDescription}</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 p-1">
          {historyFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-semibold text-white/70 transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glass-accent/40",
                activeFilter === filter.id &&
                  "bg-white/25 text-white shadow-glass"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </header>

      <section className="glass-surface flex-1 overflow-hidden">
        {visibleMessages.length ? (
          <ul className="thin-scrollbar flex h-full flex-col gap-3 overflow-y-auto p-5 pr-3 scroll-smooth-touch">
            {visibleMessages.map((message) => {
              const direction = directionMeta[message.direction];
              const DirectionIcon = direction.icon;
              const isLink = message.type === "link";
              const kindLabel = kindLabels[message.counterpartKind];

              let linkHostname: string | null = null;
              if (isLink) {
                try {
                  const url = new URL(message.content);
                  linkHostname = url.hostname.replace(/^www\./, "");
                } catch {
                  linkHostname = null;
                }
              }

              const counterpartVariant =
                message.counterpartKind === "group"
                  ? "info"
                  : message.counterpartKind === "saved"
                  ? "neutral"
                  : "success";

              return (
                <li key={message.id} className="glass-card flex gap-3">
                  <Avatar
                    name={message.counterpartName}
                    src={message.counterpartAvatarUrl ?? undefined}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-white">
                          {message.counterpartName}
                        </p>
                        <Badge variant={direction.badgeVariant}>
                          <DirectionIcon className="mr-1 h-3 w-3" />
                          {direction.label}
                        </Badge>
                        <Badge variant={counterpartVariant}>{kindLabel}</Badge>
                      </div>
                      <span className="text-xs text-white/60">
                        {message.timestampLabel}
                      </span>
                    </div>
                    {message.counterpartHandle ? (
                      <p className="mt-1 text-xs text-white/60">
                        {message.counterpartHandle}
                      </p>
                    ) : null}

                    <div className="mt-3 rounded-2xl border border-white/10 bg-white/8 px-3 py-2 text-sm text-white">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-white/60">
                        {isLink ? (
                          <>
                            <Link2 className="h-3 w-3" />
                            <span>Link</span>
                            {linkHostname ? <span aria-hidden>•</span> : null}
                            {linkHostname ? <span>{linkHostname}</span> : null}
                          </>
                        ) : (
                          <>
                            <MessageSquareText className="h-3 w-3" />
                            <span>Note</span>
                          </>
                        )}
                      </div>
                      {isLink ? (
                        <a
                          href={message.content}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 block break-all text-sm font-medium text-white underline decoration-white/40 underline-offset-4 transition hover:text-glass-accent"
                          title={message.content}
                        >
                          {message.contentPreview}
                        </a>
                      ) : (
                        <p className="mt-2 text-sm font-medium text-white">
                          {message.content}
                        </p>
                      )}
                    </div>

                    {message.note ? (
                      <p className="mt-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                        “{message.note}”
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-white/70">
            <p className="text-base font-semibold text-white">
              {activeFilter === "sent"
                ? "No shares yet"
                : "Nothing in your inbox"}
            </p>
            <p className="text-xs text-white/60">
              {activeFilter === "sent"
                ? "Share a link or note with a friend to start your history."
                : "When someone shares something with you, it will appear here."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
