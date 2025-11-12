import { z } from "zod";

import {
  FriendsResponseSchema,
  FriendRequestsResponseSchema,
  FriendRequestWithUserSchema,
  GroupMessagesResponseSchema,
  GroupsResponseSchema,
  MeResponseSchema,
  SendMessagePayloadSchema,
  SendMessageResponseSchema,
  UsersSearchResponseSchema,
} from "@/api/schemas";
import { request } from "@/api/client";

export type FriendRequestWithUser = z.infer<typeof FriendRequestWithUserSchema>;
export type SendMessagePayload = z.infer<typeof SendMessagePayloadSchema>;

export const api = {
  getCurrentUser: () => request("/users/me", MeResponseSchema),
  getFriends: () => request("/friends", FriendsResponseSchema),
  getFriendRequests: () =>
    request("/friends/requests", FriendRequestsResponseSchema),
  getGroups: () => request("/groups", GroupsResponseSchema),
  getGroupMessages: (groupId: string) =>
    request(`/groups/${groupId}/messages`, GroupMessagesResponseSchema),
  searchUsers: (query: string, limit = 10) =>
    request(
      `/users/search?q=${encodeURIComponent(query)}&limit=${limit}`,
      UsersSearchResponseSchema
    ),
  sendMessage: (payload: SendMessagePayload) =>
    request("/messages/send", SendMessageResponseSchema, {
      method: "POST",
      body: JSON.stringify(SendMessagePayloadSchema.parse(payload)),
    }),
};
