import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { cleanDate } from "@/lib/helper";

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

      const loggedResponse = report.map((entry) => {
        return {
          id: entry.id,
          date: cleanDate(entry.date),
          time: entry.time,
          userId: entry.User.id,
          user: entry.User.name,
          projectId: entry.Project.id,
          project: entry.Project.name,
          clientId: entry.Project.Client.id,
          client: entry.Project.Client.name,
          billable: entry.billable,
          status: entry.status,
          comments: entry.comments,
          approved: entry.approved,
          approvedBy: entry.approvedBy,
          approvedAt: entry.approvedAt,
        };
      });
      return loggedResponse;
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
        orderBy: { User: { name: "asc" } }, // Verify this later
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
          billableTime: true,
          nonBillableTime: true,
          status: true,
          createdAt: true,
        },
      });
      return report;
    }),
});
