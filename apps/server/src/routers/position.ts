import { z } from "zod";
import { router, protectedProcedure } from "../lib/trpc";
import { position, rateCard } from "../db/schema/position";
import { db } from "../db";
import { eq, asc } from "drizzle-orm";

export const positionRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await db
      .select({
        id: position.id,
        name: position.name,
        description: position.description,
      })
      .from(position)
      .orderBy(asc(position.name))
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
        name: input.name,
        description: input.description,
        organizationId: ctx.session.activeOrganizationId!,
        createdById: input.memberId,
        updatedById: input.memberId,
      });
    }),

  getRateCards: protectedProcedure.query(async ({ ctx }) => {
    const rateCards = await db
      .select({
        id: rateCard.id,
        positionId: rateCard.positionId,
        positionName: position.name,
        rate: rateCard.rate,
        currency: rateCard.currency,
      })
      .from(rateCard)
      .innerJoin(position, eq(rateCard.positionId, position.id))
      .where(eq(rateCard.organizationId, ctx.session.activeOrganizationId!));

    return rateCards;
  }),

  createRateCard: protectedProcedure
    .input(
      z.object({
        positionId: z.number(),
        rate: z.string().min(1),
        currency: z.string().default("USD"),
        memberId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await db.insert(rateCard).values({
        positionId: input.positionId,
        rate: input.rate,
        currency: input.currency,
        organizationId: ctx.session.activeOrganizationId!,
        createdById: input.memberId,
        updatedById: input.memberId,
      });
    }),
});
