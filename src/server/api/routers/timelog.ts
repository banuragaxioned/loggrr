import { z } from "zod";
import { cleanDate, getTimeInMinutes } from "@/utils/helper";

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
      const selectedDate = cleanDate(input.date);

      // add 1 day to selectedDate
      const oneDayForward = new Date(selectedDate.getTime() + (24 * 60 * 60 * 1000));
      const newFDClean = cleanDate(oneDayForward);

      const timelogs = await ctx.prisma.timeEntry.findMany({
        where: {
          Tenant: { slug: input.slug },
          User: { id: ctx.session.user.id },
          date: { gte: selectedDate, lt: newFDClean },
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
