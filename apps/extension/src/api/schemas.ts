import {
  FriendRequestSchema,
  GroupIdSchema,
  GroupSchema,
  MessageSchema,
  MessageTypeSchema,
  UserIdSchema,
  UserSchema,
} from "@shoot/shared";
import { z } from "zod";

export const ProvidersResponseSchema = z.object({
  providers: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
});

export const MeResponseSchema = z.object({
  user: UserSchema,
});

export const FriendsResponseSchema = z.object({
  friends: z.array(UserSchema),
});

export const FriendRequestWithUserSchema = z.object({
  request: FriendRequestSchema,
  user: UserSchema.nullable(),
});

export const FriendRequestsResponseSchema = z.object({
  incoming: z.array(FriendRequestWithUserSchema),
  outgoing: z.array(FriendRequestWithUserSchema),
});

export const GroupsResponseSchema = z.object({
  groups: z.array(GroupSchema),
});

export const GroupMessagesResponseSchema = z.object({
  messages: z.array(MessageSchema),
});

export const UsersSearchResponseSchema = z.object({
  users: z.array(UserSchema),
});

const BaseSendMessagePayloadSchema = z.object({
  content: z.string().min(1).max(2048),
  note: z.string().max(512).optional().nullable(),
  type: MessageTypeSchema.default("link"),
});

export const SendMessagePayloadSchema = z.discriminatedUnion("targetType", [
  z
    .object({
      targetType: z.literal("user"),
      targetId: UserIdSchema,
    })
    .merge(BaseSendMessagePayloadSchema),
  z
    .object({
      targetType: z.literal("group"),
      targetId: GroupIdSchema,
    })
    .merge(BaseSendMessagePayloadSchema),
  z
    .object({
      targetType: z.literal("saved"),
    })
    .merge(BaseSendMessagePayloadSchema),
]);

export const SendMessageResponseSchema = z.object({
  message: MessageSchema,
});
