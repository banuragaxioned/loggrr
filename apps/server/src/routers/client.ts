import { z } from "zod";
import { router, protectedProcedure } from "../lib/trpc";
import { client } from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

export const clientRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await db.select().from(client).where(eq(client.organizationId, ctx.session.activeOrganizationId!));
  }),
  create: protectedProcedure.input(z.object({ name: z.string().min(1) })).mutation(async ({ input, ctx }) => {
    return await db.insert(client).values({
      name: input.name,
      organizationId: ctx.session.activeOrganizationId!,
    });
  }),
});
