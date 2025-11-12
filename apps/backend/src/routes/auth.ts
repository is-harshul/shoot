import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

const mockTokens = new Set<string>();

const SignInBodySchema = z.object({
  email: z.string().email().optional(),
  provider: z.enum(["github", "google"]).optional(),
});

export const authRoutes = new Hono();

authRoutes.get("/providers", (c) =>
  c.json({
    providers: [
      { id: "github", name: "GitHub" },
      { id: "google", name: "Google" },
    ],
  })
);

authRoutes.post("/mock", async (c) => {
  const result = SignInBodySchema.safeParse(await c.req.json());
  if (!result.success) {
    throw new HTTPException(400, {
      res: c.json({
        error: "invalid_request",
        details: result.error.flatten(),
      }),
    });
  }

  const token = crypto.randomUUID();
  mockTokens.add(token);

  return c.json({
    token,
    expiresIn: 60 * 60,
  });
});

authRoutes.post("/mock/logout", async (c) => {
  const body = await c.req.json<{ token?: string }>();
  if (body?.token) {
    mockTokens.delete(body.token);
  }
  return c.json({ success: true });
});
