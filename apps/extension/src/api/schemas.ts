import {
  FriendRequestSchema,
  GroupSchema,
  MessageSchema,
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
