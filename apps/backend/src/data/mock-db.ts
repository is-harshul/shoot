import type { FriendRequest, Group, Message, User } from "@shoot/shared";

const now = new Date();

export const mockUsers: User[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    username: "harshul",
    displayName: "Harshul Kansal",
    email: "harshul@example.com",
    avatarUrl: null,
    friends: [
      "22222222-2222-2222-2222-222222222222",
      "33333333-3333-3333-3333-333333333333",
    ],
    groups: ["aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    username: "alice",
    displayName: "Alice Johnson",
    email: "alice@example.com",
    avatarUrl: null,
    friends: [
      "11111111-1111-1111-1111-111111111111",
      "33333333-3333-3333-3333-333333333333",
    ],
    groups: ["aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    username: "bob",
    displayName: "Bob Martin",
    email: "bob@example.com",
    avatarUrl: null,
    friends: [
      "11111111-1111-1111-1111-111111111111",
      "22222222-2222-2222-2222-222222222222",
    ],
    groups: ["aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  },
];

export const mockGroups: Group[] = [
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    name: "Team Links",
    avatarUrl: null,
    ownerId: "11111111-1111-1111-1111-111111111111",
    members: [
      "11111111-1111-1111-1111-111111111111",
      "22222222-2222-2222-2222-222222222222",
      "33333333-3333-3333-3333-333333333333",
    ],
    createdAt: now.toISOString(),
  },
];

export const mockMessages: Message[] = [
  {
    id: "44444444-4444-4444-4444-444444444444",
    fromUser: "11111111-1111-1111-1111-111111111111",
    toUser: "22222222-2222-2222-2222-222222222222",
    type: "link",
    content: "https://example.com/productivity",
    note: "Great read!",
    createdAt: now.toISOString(),
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    fromUser: "22222222-2222-2222-2222-222222222222",
    toUser: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    type: "text",
    content: "New figma board is up 🚀",
    note: null,
    createdAt: now.toISOString(),
  },
];

export const mockFriendRequests: FriendRequest[] = [
  {
    id: "66666666-6666-6666-6666-666666666666",
    fromUser: "33333333-3333-3333-3333-333333333333",
    toUser: "11111111-1111-1111-1111-111111111111",
    status: "pending",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  },
];
