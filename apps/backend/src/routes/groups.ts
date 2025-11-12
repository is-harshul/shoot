import type { Group, Message } from "@shoot/shared";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import { mockGroups, mockMessages } from "../data/mock-db.js";
import { CURRENT_USER_ID } from "../utils/current-user.js";

export const groupsRoutes = new Hono();

groupsRoutes.get("/", (c) => {
  const groups = mockGroups.filter((group: Group) =>
    group.members.includes(CURRENT_USER_ID)
  );
  return c.json({ groups });
});

groupsRoutes.get("/:groupId", (c) => {
  const groupId = c.req.param("groupId");
  const group = mockGroups.find((entry) => entry.id === groupId);
  if (!group) {
    throw new HTTPException(404, { res: c.json({ error: "not_found" }) });
  }

  if (!group.members.includes(CURRENT_USER_ID)) {
    throw new HTTPException(403, { res: c.json({ error: "forbidden" }) });
  }

  return c.json({ group });
});

groupsRoutes.get("/:groupId/messages", (c) => {
  const groupId = c.req.param("groupId");
  const group = mockGroups.find((entry) => entry.id === groupId);
  if (!group) {
    throw new HTTPException(404, { res: c.json({ error: "not_found" }) });
  }

  if (!group.members.includes(CURRENT_USER_ID)) {
    throw new HTTPException(403, { res: c.json({ error: "forbidden" }) });
  }

  const messages = mockMessages.filter(
    (message: Message) => message.toUser === groupId
  );

  return c.json({ messages });
});
