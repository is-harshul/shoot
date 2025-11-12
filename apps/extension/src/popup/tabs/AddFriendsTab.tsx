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
    <div className="flex h-full flex-col gap-glass-lg">
      <section className="rounded-glass border border-white/20 bg-white/20 p-glass-lg shadow-glass backdrop-blur-glass">
        <h3 className="text-base font-semibold text-white">
          Find users by User ID or Email
        </h3>
        <div className="mt-glass-sm flex flex-col gap-glass-sm md:flex-row">
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
        <p className="mt-glass-sm text-xs text-white/70">
          Search is case-insensitive and matches display name, username, or
          email.
        </p>
      </section>

      <section className="space-y-glass-sm rounded-glass border border-white/15 bg-white/15 p-glass-lg shadow-glass-soft backdrop-blur-glass">
        <header className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">Results</h3>
          <Button variant="ghost" size="sm" className="h-9 px-glass-sm text-xs">
            Invite by email
          </Button>
        </header>
        <ul className="list-none space-y-glass-sm">
          {isSearching ? (
            <li className="rounded-glass border border-dashed border-white/25 bg-white/20 p-glass text-sm font-semibold text-white">
              Searching…
            </li>
          ) : potentialMatches.length ? (
            potentialMatches.map((match) => (
              <li
                key={match.id}
                className="flex items-center justify-between rounded-glass border border-white/20 bg-white/18 px-glass py-glass-sm shadow-glass-soft backdrop-blur-glass transition hover:-translate-y-0.5 hover:bg-white/25 hover:shadow-glass"
              >
                <div>
                  <p className="text-sm font-semibold text-white">
                    {match.displayName}
                  </p>
                  <p className="text-xs text-white/70">{match.handle}</p>
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
                    className="h-9 px-glass-sm text-xs"
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
            <li className="rounded-glass border border-dashed border-white/25 bg-white/20 p-glass text-sm text-white/80">
              No results yet. Try a different email or invite someone directly.
            </li>
          ) : (
            <li className="rounded-glass border border-dashed border-white/20 bg-white/15 p-glass text-sm text-white/70">
              Start a search to find new friends.
            </li>
          )}
        </ul>
      </section>

      <section className="space-y-glass-sm rounded-glass border border-white/15 bg-white/15 p-glass-lg shadow-glass-soft backdrop-blur-glass">
        <h3 className="text-base font-semibold text-white">
          Pending Requests (incoming)
        </h3>
        <ul className="list-none space-y-glass-sm">
          {incomingRequests.length ? (
            incomingRequests.map((request) => (
              <li
                key={request.id}
                className="flex flex-wrap items-center justify-between gap-glass-sm rounded-glass border border-white/20 bg-white/18 px-glass py-glass-sm shadow-glass-soft backdrop-blur-glass"
              >
                <div>
                  <p className="text-sm font-semibold text-white">
                    {request.fromName}
                  </p>
                  <p className="text-xs text-white/70">
                    {request.message ?? "wants to connect"} •{" "}
                    {request.mutualCount} mutuals
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-9 px-glass-sm text-xs"
                  >
                    Accept
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-glass-sm text-xs"
                  >
                    Reject
                  </Button>
                </div>
              </li>
            ))
          ) : (
            <li className="rounded-glass border border-dashed border-white/20 bg-white/15 p-glass text-sm text-white/70">
              No incoming requests right now.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
};
