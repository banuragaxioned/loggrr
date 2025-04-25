import { z } from "zod";
import { router, protectedProcedure } from "../lib/trpc";
import { client } from "../db/schema";
import { db } from "../db";

export const clientRouter = router({
  getAll: protectedProcedure.query(async () => {
    return await db.select().from(client);
  }),
  create: protectedProcedure.input(z.object({ name: z.string().min(1) })).mutation(async ({ input, ctx }) => {
    return await db.insert(client).values({
      name: input.name,
      organizationId: ctx.session.session.activeOrganizationId!,
    });
  }),
});
