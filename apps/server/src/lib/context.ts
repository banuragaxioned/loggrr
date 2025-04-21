import type { Context as HonoContext } from "hono";
import { auth } from "./auth";

export type CreateContextOptions = {
  context: HonoContext;
};

export async function createContext({ context }: CreateContextOptions) {
  const session = await auth(context.env).api.getSession({
    headers: context.req.raw.headers,
  });
  return { session };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
