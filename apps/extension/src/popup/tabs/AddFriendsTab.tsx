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
      <section className="glass-panel space-y-4 bg-white/[0.12]">
        <div>
          <p className="section-title">Add friends</p>
          <h3 className="text-lg font-semibold text-white">
            Find users by User ID or email
          </h3>
        </div>
        <div className="flex flex-col gap-3 md:flex-row">
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
        <p className="text-xs text-white/65">
          Search is case-insensitive and matches display name, username, or
          email.
        </p>
      </section>

      <section className="glass-panel space-y-4">
        <header className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">Results</h3>
          <Button variant="ghost" size="sm">
            Invite by email
          </Button>
        </header>
        <ul className="list-none space-y-3">
          {isSearching ? (
            <li className="glass-card border border-dashed border-white/25 bg-white/15 text-sm font-semibold text-white">
              Searching…
            </li>
          ) : potentialMatches.length ? (
            potentialMatches.map((match) => (
              <li
                key={match.id}
                className="glass-card flex items-center justify-between"
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
                    className="min-w-[108px]"
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
            <li className="glass-card border border-dashed border-white/25 bg-white/15 text-sm text-white/80">
              No results yet. Try a different email or invite someone directly.
            </li>
          ) : (
            <li className="glass-card border border-dashed border-white/20 bg-white/10 text-sm text-white/70">
              Start a search to find new friends.
            </li>
          )}
        </ul>
      </section>

      <section className="glass-panel space-y-4">
        <h3 className="text-base font-semibold text-white">
          Pending Requests (incoming)
        </h3>
        <ul className="list-none space-y-3">
          {incomingRequests.length ? (
            incomingRequests.map((request) => (
              <li
                key={request.id}
                className="glass-card flex flex-wrap items-center justify-between gap-3"
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
                  <Button variant="secondary" size="sm">
                    Accept
                  </Button>
                  <Button variant="ghost" size="sm">
                    Reject
                  </Button>
                </div>
              </li>
            ))
          ) : (
            <li className="glass-card border border-dashed border-white/20 bg-white/10 text-sm text-white/70">
              No incoming requests right now.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
};
