import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.json({ status: "ok" }));

const port = Number.parseInt(process.env.PORT ?? "8787", 10);

serve({
  fetch: app.fetch,
  port,
});

console.info(`[backend] listening on http://localhost:${port}`);
