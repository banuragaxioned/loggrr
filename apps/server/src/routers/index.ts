import { protectedProcedure, publicProcedure, router } from "@/lib/trpc";
import { todoRouter } from "./todo";
import { clientRouter } from "./client";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
      organizationId: ctx.session.session.activeOrganizationId,
    };
  }),
  todo: todoRouter,
  client: clientRouter,
});

export type AppRouter = typeof appRouter;
