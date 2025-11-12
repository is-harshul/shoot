export type FriendPresence = "online" | "offline" | "pending" | "requested";

export interface FriendListItem {
  id: string;
  displayName: string;
  handle: string;
  presence: FriendPresence;
  avatarUrl?: string | null;
  lastSeen?: string;
  meta?: string;
  isSaved?: boolean;
}

export interface PotentialFriend {
  id: string;
  displayName: string;
  handle: string;
  status: "connected" | "pending" | "requested";
  avatarUrl?: string | null;
}

export interface IncomingRequest {
  id: string;
  fromName: string;
  message?: string;
  mutualCount: number;
}

export interface GroupSummary {
  id: string;
  name: string;
  memberCount: number;
  latestActivity: string;
  lastPostPreview: string;
  avatarUrl?: string | null;
}

export interface GroupMessage {
  id: string;
  author: string;
  timestamp: string;
  content: string;
  type: "link" | "text";
}
