import { createTRPCRouter } from "../init";
import { testRouter } from "./test";

export const appRouter = createTRPCRouter({
  test: testRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
