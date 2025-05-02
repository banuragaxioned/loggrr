import { protectedProcedure, publicProcedure, router } from "../lib/trpc";
import { todoRouter } from "./todo";
import { clientRouter } from "./client";
import { projectRouter } from "./project";
import { memberRouter } from "./member";
import { estimateRouter } from "./estimate";
import { skillRouter } from "./skill";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session,
    };
  }),
  todo: todoRouter,
  client: clientRouter,
  project: projectRouter,
  member: memberRouter,
  estimate: estimateRouter,
  skill: skillRouter,
});

export type AppRouter = typeof appRouter;
