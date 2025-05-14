import { z } from "zod";
import { router, protectedProcedure } from "../lib/trpc";
import { getEstimates, getEstimateById, getEstimateItems, createEstimate, createEstimateItem } from "../db/queries";

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
        name: input.name,
        description: input.description,
        projectId: input.projectId,
        startDate: input.startDate,
        endDate: input.endDate,
        createdById: input.memberId,
        updatedById: input.memberId,
      });
    }),

  createItem: protectedProcedure
    .input(
      z.object({
        estimateId: z.number(),
        positionId: z.number(),
        duration: z.number(),
        memberId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await createEstimateItem({
        estimateId: input.estimateId,
        positionId: input.positionId,
        duration: input.duration,
        organizationId: ctx.session.activeOrganizationId!,
        createdById: input.memberId,
        updatedById: input.memberId,
      });
    }),
});
