import { Hono } from "hono";

import { authRoutes } from "./auth.js";
import { friendsRoutes } from "./friends.js";
import { groupsRoutes } from "./groups.js";
import { messagesRoutes } from "./messages.js";
import { usersRoutes } from "./users.js";

export const apiRoutes = new Hono()
  .route("/auth", authRoutes)
  .route("/users", usersRoutes)
  .route("/friends", friendsRoutes)
  .route("/groups", groupsRoutes)
  .route("/messages", messagesRoutes);
