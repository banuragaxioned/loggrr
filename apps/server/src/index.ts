import "dotenv/config";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { stream } from "hono/streaming";
import { createContext } from "./lib/context";
import { appRouter } from "./routers/index";
import { auth } from "./lib/auth";

const app = new Hono();

app.use(logger());

app.use("/*", async (c, next) => {
  return cors({
    origin: process.env.CORS_ORIGIN!,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })(c, next);
});

app.on(["POST", "GET"], "/api/auth/**", async (c) => {
  const authHandler = auth.handler;
  return authHandler(c.req.raw);
});

app.use("/trpc/*", async (c, next) => {
  const tRPCHandler = trpcServer({
    router: appRouter,
    createContext: async (_opts) => {
      return createContext({ context: c });
    },
  });

  return tRPCHandler(c, next);
});

// AI chat endpoint
app.post("/ai", async (c) => {
  const body = await c.req.json();
  const messages = body.messages || [];

  const result = streamText({
    model: google("gemini-1.5-flash"),
    messages,
  });

  c.header("X-Vercel-AI-Data-Stream", "v1");
  c.header("Content-Type", "text/plain; charset=utf-8");

  return stream(c, (stream) => stream.pipe(result.toDataStream()));
});

app.get("/", (c) => {
  return c.text("OK");
});

import { serve } from "@hono/node-server";

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
