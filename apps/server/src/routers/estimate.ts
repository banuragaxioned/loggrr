import { z } from "zod";
import { router, protectedProcedure } from "../lib/trpc";
import { createEstimate, createEstimateItem, getEstimateById, getEstimateItems, getEstimates } from "../db/queries";

export const estimateRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await getEstimates(ctx.session.activeOrganizationId!);
  }),

  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input, ctx }) => {
    return await getEstimateById(ctx.session.activeOrganizationId!, input.id);
  }),

  getItems: protectedProcedure.input(z.object({ estimateId: z.number() })).query(async ({ input, ctx }) => {
    return await getEstimateItems(ctx.session.activeOrganizationId!, input.estimateId);
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        projectId: z.number(),
        startDate: z.string(),
        endDate: z.string().optional(),
        memberId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await createEstimate(ctx.session.activeOrganizationId!, {
        ...input,
        createdById: input.memberId,
        updatedById: input.memberId,
      });
    }),

  createItem: protectedProcedure
    .input(
      z.object({
        estimateId: z.number(),
        skillId: z.number(),
        duration: z.number(),
        rate: z.string(),
        currency: z.string(),
        memberId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await createEstimateItem(ctx.session.activeOrganizationId!, {
        ...input,
        createdById: input.memberId,
        updatedById: input.memberId,
      });
    }),
});
