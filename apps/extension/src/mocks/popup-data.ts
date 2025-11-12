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

export const mockFriends: FriendListItem[] = [
  {
    id: "user-alice",
    displayName: "Alice Johnson",
    handle: "alice#1024",
    presence: "online",
    avatarUrl: null,
    meta: "Available",
  },
  {
    id: "user-bob",
    displayName: "Bob Martinez",
    handle: "bob#2048",
    presence: "offline",
    lastSeen: "10m ago",
  },
  {
    id: "user-saved",
    displayName: "Saved (you)",
    handle: "saved",
    presence: "online",
    isSaved: true,
    meta: "Private space",
  },
  {
    id: "user-devika",
    displayName: "Devika Patel",
    handle: "devika#8830",
    presence: "pending",
    meta: "Request pending",
  },
  {
    id: "user-eman",
    displayName: "Eman Chen",
    handle: "eman#4202",
    presence: "offline",
    lastSeen: "2h ago",
  },
];

export const mockPotentialFriends: PotentialFriend[] = [
  {
    id: "user-harshul",
    displayName: "Harshul Kansal",
    handle: "harshul#1234",
    status: "connected",
  },
  {
    id: "user-priya",
    displayName: "Priya Sharma",
    handle: "priya#456",
    status: "pending",
  },
  {
    id: "user-jamie",
    displayName: "Jamie Lee",
    handle: "jamie#789",
    status: "requested",
  },
];

export const mockIncomingRequests: IncomingRequest[] = [
  {
    id: "request-raj",
    fromName: "Raj Mehta",
    message: "Let’s swap design inspo links!",
    mutualCount: 3,
  },
  {
    id: "request-anika",
    fromName: "Anika Rao",
    mutualCount: 1,
  },
];

export const mockGroups: GroupSummary[] = [
  {
    id: "group-team-links",
    name: "Team Links",
    memberCount: 3,
    latestActivity: "2m ago",
    lastPostPreview: "Harshul shared “Dev productivity tips”",
  },
  {
    id: "group-design-crew",
    name: "Design Crew",
    memberCount: 8,
    latestActivity: "30m ago",
    lastPostPreview: "Devika pinned “New figma board”",
  },
  {
    id: "group-reading-list",
    name: "Reading List",
    memberCount: 5,
    latestActivity: "1h ago",
    lastPostPreview: "Alice saved “AI research roundup”",
  },
];

export const mockGroupMessages: Record<string, GroupMessage[]> = {
  "group-team-links": [
    {
      id: "msg-1",
      author: "Harshul",
      timestamp: "10:12",
      content: "https://linear.app/roadmap-update",
      type: "link",
    },
    {
      id: "msg-2",
      author: "Priya",
      timestamp: "10:10",
      content: "Shared a quick summary doc",
      type: "text",
    },
  ],
  "group-design-crew": [
    {
      id: "msg-3",
      author: "Devika",
      timestamp: "09:45",
      content: "https://figma.com/file/abc123-shoot-ui",
      type: "link",
    },
  ],
  "group-reading-list": [
    {
      id: "msg-4",
      author: "Alice",
      timestamp: "08:20",
      content: "https://newsletter.com/ai-roundup",
      type: "link",
    },
  ],
};

export const defaultSelectedGroupId = mockGroups[0]?.id ?? null;
