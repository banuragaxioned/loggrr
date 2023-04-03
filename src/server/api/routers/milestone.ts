import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Status } from "@prisma/client";

export const milestoneRouter = createTRPCRouter({
  // Get all Milestones for the current project
  getMilestones: protectedProcedure
    .input(z.object({ pid: z.string() }))
    .query(async ({ ctx, input }) => {
      const projectId = +input.pid;
      const milestones = await ctx.prisma.milestone.findMany({
        where: { projectId: projectId, status: Status.PUBLISHED },
      });
      return milestones;
    }),
  // Create a new Milestone
  addMilestone: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        pid: z.number(),
        name: z.string(),
        budget: z.number().optional(),
        startdate: z.date().optional(),
        enddate: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const milestone = await ctx.prisma.milestone.create({
        data: {
          Project: { connect: { id: input.pid } },
          // Need to add a step to check if the name is empty, startDate exists for the milestone and project frequency is not FIXED - in this case, autogenerate the name (create a separate util for this?)
          name: input.name,
          budget: input.budget,
          startDate: input.startdate,
          endDate: input.enddate,
          Tenant: { connect: { slug: input.slug } },
        },
      });
      return milestone;
    }),
});
