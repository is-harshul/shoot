import { z } from "zod";

export const UserIdSchema = z.string().uuid();
export type UserId = z.infer<typeof UserIdSchema>;

export const GroupIdSchema = z.string().uuid();
export type GroupId = z.infer<typeof GroupIdSchema>;

export const UsernameSchema = z
  .string()
  .min(3)
  .max(32)
  .regex(
    /^[a-zA-Z0-9_.-]+$/,
    "Only letters, numbers, underscore, dot, and hyphen allowed"
  );

export const UserSchema = z.object({
  id: UserIdSchema,
  username: UsernameSchema,
  displayName: z.string().min(1).max(64),
  email: z.string().email(),
  avatarUrl: z.string().url().nullable(),
  friends: z.array(UserIdSchema),
  groups: z.array(GroupIdSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type User = z.infer<typeof UserSchema>;

export const FriendRequestStatusSchema = z.enum([
  "pending",
  "accepted",
  "rejected",
]);
export type FriendRequestStatus = z.infer<typeof FriendRequestStatusSchema>;

export const FriendRequestSchema = z.object({
  id: z.string().uuid(),
  fromUser: UserIdSchema,
  toUser: UserIdSchema,
  status: FriendRequestStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type FriendRequest = z.infer<typeof FriendRequestSchema>;

export const GroupSchema = z.object({
  id: GroupIdSchema,
  name: z.string().min(1).max(64),
  avatarUrl: z.string().url().nullable(),
  ownerId: UserIdSchema,
  members: z.array(UserIdSchema),
  createdAt: z.string(),
});
export type Group = z.infer<typeof GroupSchema>;

export const MessageTypeSchema = z.enum(["link", "text"]);
export type MessageType = z.infer<typeof MessageTypeSchema>;

export const MessageSchema = z.object({
  id: z.string().uuid(),
  fromUser: UserIdSchema,
  toUser: z.union([UserIdSchema, GroupIdSchema, z.literal("saved")]),
  type: MessageTypeSchema,
  content: z.string(),
  note: z.string().nullable(),
  createdAt: z.string(),
});
export type Message = z.infer<typeof MessageSchema>;

export const createPaginatedResponseSchema = <Schema extends z.ZodTypeAny>(
  itemSchema: Schema
) =>
  z.object({
    items: z.array(itemSchema),
    cursor: z.string().nullable(),
    hasMore: z.boolean(),
  });

export type PaginatedResponse<Item> = {
  items: Item[];
  cursor: string | null;
  hasMore: boolean;
};

export const StorageBucket = {
  Avatars: "avatars",
  GroupIcons: "group-icons",
} as const;

export type StorageBucket = (typeof StorageBucket)[keyof typeof StorageBucket];
