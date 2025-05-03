import { z } from "zod";
import { router, protectedProcedure } from "../lib/trpc";
import { db } from "../db";
import { position, positionLevel } from "../db/schema";
import { eq, and } from "drizzle-orm";

export const positionRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await db
      .select({
        id: position.id,
        name: position.name,
        description: position.description,
      })
      .from(position)
      .where(eq(position.organizationId, ctx.session.activeOrganizationId!));
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
      return await db.insert(position).values({
        organizationId: ctx.session.activeOrganizationId!,
        name: input.name,
        description: input.description,
        createdById: input.memberId,
        updatedById: input.memberId,
      });
    }),

  getLevels: protectedProcedure.input(z.object({ positionId: z.number() })).query(async ({ input, ctx }) => {
    return await db
      .select({
        id: positionLevel.id,
        name: positionLevel.name,
        description: positionLevel.description,
        rate: positionLevel.rate,
        currency: positionLevel.currency,
      })
      .from(positionLevel)
      .where(
        and(
          eq(positionLevel.organizationId, ctx.session.activeOrganizationId!),
          eq(positionLevel.positionId, input.positionId),
        ),
      );
  }),

  createLevel: protectedProcedure
    .input(
      z.object({
        positionId: z.number(),
        name: z.string().min(1),
        description: z.string().optional(),
        rate: z.string(),
        currency: z.string().default("USD"),
        memberId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await db.insert(positionLevel).values({
        organizationId: ctx.session.activeOrganizationId!,
        positionId: input.positionId,
        name: input.name,
        description: input.description,
        rate: input.rate,
        currency: input.currency,
        createdById: input.memberId,
        updatedById: input.memberId,
      });
    }),
});
