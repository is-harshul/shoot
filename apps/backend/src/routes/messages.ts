import type { Message } from "@shoot/shared";
import { GroupIdSchema, MessageTypeSchema, UserIdSchema } from "@shoot/shared";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

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

const BaseSendMessageSchema = z.object({
  content: z.string().min(1).max(2048),
  note: z.string().max(512).optional().nullable(),
  type: MessageTypeSchema.default("link"),
});

const SendMessageSchema = z.discriminatedUnion("targetType", [
  z
    .object({
      targetType: z.literal("user"),
      targetId: UserIdSchema,
    })
    .merge(BaseSendMessageSchema),
  z
    .object({
      targetType: z.literal("group"),
      targetId: GroupIdSchema,
    })
    .merge(BaseSendMessageSchema),
  z
    .object({
      targetType: z.literal("saved"),
    })
    .merge(BaseSendMessageSchema),
]);

messagesRoutes.post("/send", async (c) => {
  const body = await c.req.json();
  const result = SendMessageSchema.safeParse(body);

  if (!result.success) {
    throw new HTTPException(400, {
      res: c.json({
        error: "invalid_request",
        details: result.error.flatten(),
      }),
    });
  }

  const payload = result.data;

  const toUser = payload.targetType === "saved" ? "saved" : payload.targetId;

  const message: Message = {
    id: crypto.randomUUID(),
    fromUser: CURRENT_USER_ID,
    toUser,
    type: payload.type,
    content: payload.content,
    note: payload.note ?? null,
    createdAt: new Date().toISOString(),
  };

  mockMessages.unshift(message);

  return c.json({ message });
});
