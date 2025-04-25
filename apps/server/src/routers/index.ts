import { protectedProcedure, publicProcedure, router } from "@/lib/trpc";
import { todoRouter } from "./todo";
import { clientRouter } from "./client";

export interface Env {
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  CORS_ORIGIN: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
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
        organizationId: ctx.session.session.activeOrganizationId,
      };
    }),
    todo: todoRouter(env),
    client: clientRouter(env),
  });

export type AppRouter = ReturnType<typeof appRouter>;
