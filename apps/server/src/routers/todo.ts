import { z } from "zod";
import { router, publicProcedure } from "@/lib/trpc";
import { todo } from "@/db/schema/todo";
import { eq } from "drizzle-orm";
import { db } from "@/db";

export interface Env {
  DATABASE_URL: string;
}

export const todoRouter = (env: Env) =>
  router({
    getAll: publicProcedure.query(async () => {
      return await db(env).select().from(todo);
    }),

    create: publicProcedure.input(z.object({ text: z.string().min(1) })).mutation(async ({ input }) => {
      return await db(env).insert(todo).values({
        text: input.text,
      });
    }),

    toggle: publicProcedure.input(z.object({ id: z.number(), completed: z.boolean() })).mutation(async ({ input }) => {
      return await db(env).update(todo).set({ completed: input.completed }).where(eq(todo.id, input.id));
    }),

    delete: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      return await db(env).delete(todo).where(eq(todo.id, input.id));
    }),
  });
