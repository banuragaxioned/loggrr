import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { cleanDate } from "@/lib/helper";

export const statsRouter = createTRPCRouter({
  getQuickStats: protectedProcedure
    .input(z.object({ tenant: z.string(), date: z.string().datetime().optional() }))
    .query(async ({ ctx, input }) => {
      const slug = input.tenant;
      const today = cleanDate(new Date());
      const dateOneWeekAgo = new Date();
      dateOneWeekAgo.setDate(dateOneWeekAgo.getDate() - 7);
      // TODO: Right now hardcoded for last 7 days, but should be able to pass in a date range (eg: last 1/7/14/30 days)
      const userId = Number(ctx.session.user.id);
      const quickStats = await ctx.prisma.timeEntry.findMany({
        where: {
          User: { id: userId },
          date: { lt: today, gte: dateOneWeekAgo },
          Tenant: { slug },
        },
        select: {
          id: true,
          time: true,
          billable: true,
          Project: { select: { id: true, name: true } },
        },
      });

      type MappedStat = {
        projectId: number;
        projectName: string;
        total: number;
      };

      const mappedStats: MappedStat[] = quickStats.reduce((acc, curr) => {
        const existingIndex = acc.findIndex((stat) => stat.projectId === curr.Project.id);
        if (existingIndex !== -1) {
          acc[existingIndex].total += curr.time;
        } else {
          acc.push({
            projectId: curr.Project.id,
            projectName: curr.Project.name,
            total: curr.time,
          });
        }
        return acc;
      }, [] as MappedStat[]);
      // TODO: Return the stats as a percentage of the total time spent
      // TODO: Return the stats as a percentage of the total time aviailable (eg: 7.5h/day * 5 days = 37.5h - holidays, sick days, etc)
      // TODO: Return all of the above stats with a breakdown of billable vs non-billable time
      return mappedStats;
    }),
});
