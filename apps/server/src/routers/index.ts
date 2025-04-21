import { protectedProcedure, publicProcedure, router } from "../lib/trpc";
import { todoRouter } from "./todo";

export interface Env {
  DATABASE_URL: string;
}

export const appRouter = (env: Env) =>
  router({
    healthCheck: publicProcedure.query(() => {
      return "OK";
    }),
    privateData: protectedProcedure.query(({ ctx }) => {
      return {
        message: "This is private",
        user: ctx.session.user,
      };
    }),
    todo: todoRouter(env),
  });

export type AppRouter = ReturnType<typeof appRouter>;
