import type { FriendRequest, User } from "@shoot/shared";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import { mockFriendRequests, mockUsers } from "../data/mock-db.js";
import { CURRENT_USER_ID, getCurrentUser } from "../utils/current-user.js";

export const friendsRoutes = new Hono();

friendsRoutes.get("/", (c) => {
  const current = getCurrentUser();
  const friends = current.friends
    .map((friendId: string) => mockUsers.find((user) => user.id === friendId))
    .filter((user): user is User => Boolean(user));

  return c.json({
    friends,
  });
});

friendsRoutes.get("/requests", (c) => {
  const enrich = (request: FriendRequest) => {
    const otherUserId =
      request.fromUser === CURRENT_USER_ID ? request.toUser : request.fromUser;
    const user = mockUsers.find((entry) => entry.id === otherUserId) ?? null;
    return { request, user };
  };

  const incoming = mockFriendRequests
    .filter(
      (request) =>
        request.toUser === CURRENT_USER_ID && request.status === "pending"
    )
    .map(enrich);

  const outgoing = mockFriendRequests
    .filter(
      (request) =>
        request.fromUser === CURRENT_USER_ID && request.status === "pending"
    )
    .map(enrich);

  return c.json({ incoming, outgoing });
});

friendsRoutes.post("/requests/:requestId/accept", (c) => {
  const requestId = c.req.param("requestId");
  const request = mockFriendRequests.find((entry) => entry.id === requestId);
  if (!request) {
    throw new HTTPException(404, {
      res: c.json({ error: "not_found" }),
    });
  }

  request.status = "accepted";
  request.updatedAt = new Date().toISOString();

  const otherUser =
    request.fromUser === CURRENT_USER_ID ? request.toUser : request.fromUser;

  const currentUser = getCurrentUser();
  if (!currentUser.friends.includes(otherUser)) {
    currentUser.friends.push(otherUser);
  }

  const counterpart = mockUsers.find((user) => user.id === otherUser);
  if (counterpart && !counterpart.friends.includes(CURRENT_USER_ID)) {
    counterpart.friends.push(CURRENT_USER_ID);
  }

  return c.json({ success: true });
});

friendsRoutes.post("/requests/:requestId/reject", (c) => {
  const requestId = c.req.param("requestId");
  const request = mockFriendRequests.find((entry) => entry.id === requestId);
  if (!request) {
    throw new HTTPException(404, {
      res: c.json({ error: "not_found" }),
    });
  }

  request.status = "rejected";
  request.updatedAt = new Date().toISOString();

  return c.json({ success: true });
});
