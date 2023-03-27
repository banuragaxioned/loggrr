import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const reportRouter = createTRPCRouter({
  // Get all time log entries for the current tenant, with optional filters
  getLogged: protectedProcedure
    .input(
      z.object({
        tenant: z.string(),
        projectId: z.number().optional(),
        clientId: z.number().optional(),
        userId: z.number().optional(),
        billable: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const slug = input.tenant;
      const report = await ctx.prisma.timeEntry.findMany({
        where: {
          Tenant: { slug: slug },
          projectId: input.projectId,
          Project: { clientId: input.clientId },
          userId: input.userId,
          billable: input.billable,
        },
        orderBy: { date: "desc" },
        select: {
          id: true,
          User: { select: { id: true, name: true } },
          Project: {
            select: {
              id: true,
              name: true,
              Client: { select: { id: true, name: true } },
            },
          },
          billable: true,
          status: true,
          time: true,
          comments: true,
          date: true,
          approved: true,
          approvedBy: true,
          approvedAt: true,
        },
      });
      return report;
    }),
  // Get all work allocation made for the current tenant, with optional filters
  getAssigned: protectedProcedure
    .input(
      z.object({
        tenant: z.string(),
        projectId: z.number().optional(),
        clientId: z.number().optional(),
        userId: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const slug = input.tenant;
      const report = await ctx.prisma.allocation.findMany({
        where: {
          Tenant: { slug: slug },
          projectId: input.projectId,
          Project: { clientId: input.clientId },
          userId: input.userId,
        },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          User: { select: { id: true, name: true } },
          Project: {
            select: {
              id: true,
              name: true,
              Client: { select: { id: true, name: true } },
            },
          },
          date: true,
          enddate: true,
          frequency: true,
          billable: true,
          nonbillable: true,
          status: true,
          createdAt: true,
        },
      });
      return report;
    }),
  // TODO: Get all time log entries for the current tenant
});
