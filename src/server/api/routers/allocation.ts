import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { AllocationFrequency } from "@prisma/client";

export const allocationRouter = createTRPCRouter({
  // Create a new time Allocaiton
  createAllocation: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        projectId: z.number(),
        userId: z.number(),
        date: z.date(),
        frequency: z.nativeEnum(AllocationFrequency),
        enddate: z.date().optional(),
        billableTime: z.number(),
        nonBillableTime: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const slug = input.slug;
      const client = await ctx.prisma.allocation.create({
        data: {
          date: input.date,
          enddate: input.enddate,
          billableTime: input.billableTime,
          frequency: input.frequency,
          nonBillableTime: input.nonBillableTime,
          Tenant: {
            connect: { slug },
          },
          Project: {
            connect: { id: input.projectId },
          },
          User: {
            connect: { id: input.userId },
          },
        },
      });
      return client;
    }),

  getAllocations: protectedProcedure
    .input(
      z.object({
        team: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        page: z.number(),
        pageSize: z.number(),
        projectId: z.number().optional(),
        clientId: z.number().optional(),
        userId: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (input.startDate > input.endDate) {
        throw new Error("Start date must be before end date");
      }

      const clients = await ctx.prisma.allocation.findMany({
        orderBy: { User: { name: "desc" } },
        where: {
          Tenant: { slug: input.team },
          date: { gte: input.startDate, lte: input.endDate },
          projectId: input.projectId,
          Project: { clientId: input.clientId },
          userId: input.userId,
        },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      });

      return clients;
    }),
});
