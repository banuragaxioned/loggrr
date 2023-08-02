import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Status } from "@prisma/client";

export const taskRouter = createTRPCRouter({
  // Get all Tasks for the current project
  getTasks: protectedProcedure.input(z.object({ pid: z.string() })).query(async ({ ctx, input }) => {
    const projectId = +input.pid;
    const tasks = await ctx.prisma.task.findMany({
      where: { projectId: projectId, status: Status.PUBLISHED },
    });
    return tasks;
  }),
  // Add a new Task for the current project
  addTask: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        pid: z.number(),
        name: z.string(),
        budget: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.create({
        data: {
          Tenant: { connect: { slug: input.slug } },
          Project: { connect: { id: input.pid } },
          name: input.name,
          budget: input.budget,
        },
      });
      return task;
    }),
});
