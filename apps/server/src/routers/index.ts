import { protectedProcedure, publicProcedure, router } from "../lib/trpc";
import { todoRouter } from "./todo";
import { clientRouter } from "./client";
import { projectRouter } from "./project";
import { memberRouter } from "./member";
import { estimateRouter } from "./estimate";
import { positionRouter } from "./position";
import { assignmentRouter } from "./assignment";

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
  position: positionRouter,
  assignment: assignmentRouter,
});

export type AppRouter = typeof appRouter;
