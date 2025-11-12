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
    <div className="flex h-full flex-col gap-5">
      <section className="rounded-3xl border-2 border-brutal-navy bg-white p-6 shadow-brutal">
        <h3 className="text-base font-semibold text-brutal-navy">
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
        <p className="mt-3 text-xs text-brutal-navy/70">
          Search is case-insensitive and matches display name, username, or
          email.
        </p>
      </section>

      <section className="space-y-4 rounded-3xl border-2 border-brutal-navy bg-white p-6 shadow-brutal-sm">
        <header className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-brutal-navy">Results</h3>
          <Button variant="ghost" size="sm" className="h-9 px-4 text-xs">
            Invite by email
          </Button>
        </header>
        <ul className="space-y-3">
          {isSearching ? (
            <li className="rounded-2xl border-2 border-dashed border-brutal-navy bg-brutal-blue/10 p-5 text-sm font-semibold text-brutal-navy">
              Searching…
            </li>
          ) : potentialMatches.length ? (
            potentialMatches.map((match) => (
              <li
                key={match.id}
                className="flex items-center justify-between rounded-3xl border-2 border-brutal-navy bg-brutal-cream px-4 py-3 shadow-brutal-sm transition hover:-translate-y-0.5 hover:shadow-brutal"
              >
                <div>
                  <p className="text-sm font-semibold text-brutal-navy">
                    {match.displayName}
                  </p>
                  <p className="text-xs text-brutal-navy/70">{match.handle}</p>
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
            <li className="rounded-2xl border-2 border-dashed border-brutal-navy bg-brutal-pink/10 p-5 text-sm text-brutal-navy">
              No results yet. Try a different email or invite someone directly.
            </li>
          ) : (
            <li className="rounded-2xl border-2 border-dashed border-brutal-navy bg-white p-5 text-sm text-brutal-navy/80">
              Start a search to find new friends.
            </li>
          )}
        </ul>
      </section>

      <section className="space-y-3 rounded-3xl border-2 border-brutal-navy bg-white p-6 shadow-brutal-sm">
        <h3 className="text-base font-semibold text-brutal-navy">
          Pending Requests (incoming)
        </h3>
        <ul className="space-y-2">
          {incomingRequests.length ? (
            incomingRequests.map((request) => (
              <li
                key={request.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border-2 border-brutal-navy bg-brutal-green/20 px-4 py-3 shadow-brutal-sm"
              >
                <div>
                  <p className="text-sm font-semibold text-brutal-navy">
                    {request.fromName}
                  </p>
                  <p className="text-xs text-brutal-navy/70">
                    {request.message ?? "wants to connect"} •{" "}
                    {request.mutualCount} mutuals
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-9 px-3 text-xs"
                  >
                    Accept
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 text-xs"
                  >
                    Reject
                  </Button>
                </div>
              </li>
            ))
          ) : (
            <li className="rounded-2xl border-2 border-dashed border-brutal-navy bg-white p-5 text-sm text-brutal-navy/80">
              No incoming requests right now.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
};
