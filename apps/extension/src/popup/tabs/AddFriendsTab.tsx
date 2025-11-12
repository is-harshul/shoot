import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { IncomingRequest, PotentialFriend } from "@/features/popup/types";

export interface AddFriendsTabProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  potentialMatches: PotentialFriend[];
  incomingRequests: IncomingRequest[];
  onSearch: () => void;
  isSearching: boolean;
}

const statusLabel: Record<PotentialFriend["status"], string> = {
  connected: "Connected",
  pending: "Pending",
  requested: "Requested",
};

export const AddFriendsTab = ({
  searchTerm,
  onSearchTermChange,
  potentialMatches,
  incomingRequests,
  onSearch,
  isSearching,
}: AddFriendsTabProps) => {
  const handleSubmit = () => {
    if (searchTerm.trim()) {
      onSearch();
    }
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <section className="rounded-2xl bg-white p-4 shadow-soft">
        <h3 className="text-sm font-semibold text-ink-900">
          Find users by User ID or Email
        </h3>
        <div className="mt-3 flex flex-col gap-2 md:flex-row">
          <Input
            placeholder="user@example.com or username#123"
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            aria-label="Search by email or user ID"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button
            className="md:w-32"
            disabled={!searchTerm.trim() || isSearching}
            onClick={handleSubmit}
          >
            Search
          </Button>
        </div>
        <p className="mt-2 text-xs text-ink-500">
          Search is case-insensitive and matches display name, username, or
          email.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl bg-white p-4 shadow-soft">
        <header className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink-900">Results</h3>
          <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
            Invite by email
          </Button>
        </header>
        <ul className="space-y-2">
          {isSearching ? (
            <li className="rounded-xl border border-dashed border-ink-200 p-4 text-sm text-ink-500">
              Searching…
            </li>
          ) : potentialMatches.length ? (
            potentialMatches.map((match) => (
              <li
                key={match.id}
                className="flex items-center justify-between rounded-xl border border-ink-200 px-3 py-2 transition hover:border-primary-200 hover:bg-primary-50/40"
              >
                <div>
                  <p className="text-sm font-medium text-ink-900">
                    {match.displayName}
                  </p>
                  <p className="text-xs text-ink-500">{match.handle}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      match.status === "connected"
                        ? "success"
                        : match.status === "pending"
                        ? "warning"
                        : "info"
                    }
                  >
                    {statusLabel[match.status]}
                  </Badge>
                  <Button
                    variant={
                      match.status === "connected" ? "secondary" : "primary"
                    }
                    size="sm"
                    className="h-9 px-3 text-xs"
                  >
                    {match.status === "connected"
                      ? "Message"
                      : match.status === "pending"
                      ? "Requested"
                      : "Add"}
                  </Button>
                </div>
              </li>
            ))
          ) : searchTerm.trim() ? (
            <li className="rounded-xl border border-dashed border-ink-200 p-4 text-sm text-ink-500">
              No results yet. Try a different email or invite someone directly.
            </li>
          ) : (
            <li className="rounded-xl border border-dashed border-ink-200 p-4 text-sm text-ink-500">
              Start a search to find new friends.
            </li>
          )}
        </ul>
      </section>

      <section className="space-y-3 rounded-2xl bg-white p-4 shadow-soft">
        <h3 className="text-sm font-semibold text-ink-900">
          Pending Requests (incoming)
        </h3>
        <ul className="space-y-2">
          {incomingRequests.length ? (
            incomingRequests.map((request) => (
              <li
                key={request.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink-200 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-ink-900">
                    {request.fromName}
                  </p>
                  <p className="text-xs text-ink-500">
                    {request.message ?? "wants to connect"} •{" "}
                    {request.mutualCount} mutuals
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 px-3 text-xs text-success-700"
                  >
                    Accept
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-xs text-danger-600"
                  >
                    Reject
                  </Button>
                </div>
              </li>
            ))
          ) : (
            <li className="rounded-xl border border-dashed border-ink-200 p-4 text-sm text-ink-500">
              No incoming requests right now.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
};
