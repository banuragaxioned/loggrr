import { z } from "zod";
import { router, protectedProcedure } from "../lib/trpc";
import { db } from "../db";
import { skill } from "../db/schema";
import { eq } from "drizzle-orm";

export const skillRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await db
      .select({
        id: skill.id,
        name: skill.name,
        description: skill.description,
      })
      .from(skill)
      .where(eq(skill.organizationId, ctx.session.activeOrganizationId!));
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        memberId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await db.insert(skill).values({
        organizationId: ctx.session.activeOrganizationId!,
        name: input.name,
        description: input.description,
        createdById: input.memberId,
        updatedById: input.memberId,
      });
    }),
});
