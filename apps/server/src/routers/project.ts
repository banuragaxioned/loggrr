import { z } from "zod";
import { router, protectedProcedure } from "../lib/trpc";
import { project } from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

export const projectRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await db.select().from(project).where(eq(project.organizationId, ctx.session.session.activeOrganizationId!));
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        clientId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await db.insert(project).values({
        name: input.name,
        clientId: input.clientId,
        organizationId: ctx.session.session.activeOrganizationId!,
        status: "active",
        archived: false,
      });
    }),
});
