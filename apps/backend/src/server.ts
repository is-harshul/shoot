import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

import { apiRoutes } from "./routes/index.js";

const app = new Hono();

app.use("*", logger());
app.use("*", cors({ origin: "*" }));
app.use("*", prettyJSON());

app.get("/", (c) => c.json({ status: "ok", service: "shoot-backend" }));
app.get("/healthz", (c) => c.json({ status: "ok" }));

app.route("/api/v1", apiRoutes);

const port = Number.parseInt(process.env.PORT ?? "8787", 10);

serve({
  fetch: app.fetch,
  port,
});

console.info(`[backend] listening on http://localhost:${port}`);
