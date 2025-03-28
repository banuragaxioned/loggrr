import { createTRPCRouter } from "../init";
import { userRouter } from "./user";
import { organizationRouter } from "./organization";

export const appRouter = createTRPCRouter({
  user: userRouter,
  organization: organizationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
