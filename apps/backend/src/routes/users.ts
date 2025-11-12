import type { User } from "@shoot/shared";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import { mockUsers } from "../data/mock-db.js";
import { getCurrentUser } from "../utils/current-user.js";

const SearchQuerySchema = z.object({
  q: z.string().trim().min(1).optional(),
  limit: z.coerce.number().min(1).max(25).default(10),
});

export const usersRoutes = new Hono();

usersRoutes.get("/me", (c) => {
  const me = getCurrentUser();
  return c.json({ user: me });
});

usersRoutes.get("/search", (c) => {
  const result = SearchQuerySchema.safeParse(c.req.query());
  if (!result.success) {
    throw new HTTPException(400, {
      res: c.json({
        error: "invalid_query",
        details: result.error.flatten(),
      }),
    });
  }

  const { q, limit } = result.data;
  if (!q) {
    return c.json({ users: [] });
  }

  const normalized = q.toLowerCase();

  const matches = mockUsers
    .filter(
      (user: User) =>
        user.displayName.toLowerCase().includes(normalized) ||
        user.username.toLowerCase().includes(normalized) ||
        user.email.toLowerCase().includes(normalized)
    )
    .slice(0, limit);

  return c.json({ users: matches });
});
