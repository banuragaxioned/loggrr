import { initTRPC, TRPCError } from "@trpc/server";
import type { Context as HonoContext } from "hono";

export const t = initTRPC.context<HonoContext>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  const user = ctx.get("user");
  const session = ctx.get("session");

  if (!user || !session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
      cause: "No session",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user,
      session,
    },
  });
});
