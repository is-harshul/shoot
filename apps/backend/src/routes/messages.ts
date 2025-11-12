import type { Message } from "@shoot/shared";
import { Hono } from "hono";

import { mockMessages } from "../data/mock-db.js";
import { CURRENT_USER_ID } from "../utils/current-user.js";

export const messagesRoutes = new Hono();

messagesRoutes.get("/inbox", (c) => {
  const inbox = mockMessages.filter(
    (message: Message) => message.toUser === CURRENT_USER_ID
  );
  return c.json({ messages: inbox });
});

messagesRoutes.get("/sent", (c) => {
  const sent = mockMessages.filter(
    (message: Message) => message.fromUser === CURRENT_USER_ID
  );
  return c.json({ messages: sent });
});
