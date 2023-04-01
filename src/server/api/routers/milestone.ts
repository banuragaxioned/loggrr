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
        where: { projectId: projectId, status: Status.PUBLISHED }
      });
      return milestones;
    }),
});
