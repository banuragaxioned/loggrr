import { z } from "zod";
import { getTimeInMinutes } from "@/utils/helper";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const timelogRouter = createTRPCRouter({
  // Create a new Timelog
  addTimelog: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        date: z.date(),
        projectId: z.number(),
        milestoneId: z.number(),
        taskId: z.number().optional(),
        billable: z.boolean(),
        time: z.string(),
        comments: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.timeEntry.create({
        data: {
          Tenant: { connect: { slug: input.slug } },
          Project: { connect: { id: input.projectId } },
          Milestone: { connect: { id: input.milestoneId } },
          Task: { connect: { id: input.taskId } },
          User: { connect: { id: ctx.session.user.id } },
          time: getTimeInMinutes(input.time),
          billable: input.billable,
          comments: input.comments,
          date: input.date,
        },
      });
      return task;
    }),
  // Get my timelogs for a date
  getMyTimeLog: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        date: z.date(),
      })
  )
    .query(async ({ ctx, input }) => {

      // TODO: This feels like a really shitty way to do it, but works.
      const selectedDate: Date = new Date(input.date)
      selectedDate.setHours(0, 0, 0, 0);

      const dateOneForward = new Date();
      dateOneForward.setDate(dateOneForward.getDate() + 1);

      const timelogs = await ctx.prisma.timeEntry.findMany({
        where: {
          Tenant: { slug: input.slug },
          User: { id: ctx.session.user.id },
          date: { lt: dateOneForward, gte: selectedDate },
        },
        include: {
          Project: true,
          Milestone: true,
          Task: true,
        },
      });
      return timelogs;
    }
  ),
});
