import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Status } from "@prisma/client";

export const taskRouter = createTRPCRouter({
  // Get all Tasks for the current project
  getTasks: protectedProcedure
    .input(z.object({ pid: z.string() }))
    .query(async ({ ctx, input }) => {
      const projectId = +input.pid;
      const tasks = await ctx.prisma.task.findMany({
        where: { projectId: projectId, status: Status.PUBLISHED },
      });
      return tasks;
    }),
});
