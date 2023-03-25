import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const timeEntryRouter = createTRPCRouter({
  // Get all available timeEntry entries for the current tenant
  getAll: protectedProcedure
    .input(z.object({ tenant: z.string() }))
    .query(async ({ ctx, input }) => {
      const slug = input.tenant;
      const timeEntries = await ctx.prisma.timeEntry.findMany({
        where: { Tenant: { slug: slug },  },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          Project: { select: { id: true, name: true, Client: { select: { id: true, name: true } } } },
          billable: true,
          status: true,
          time: true,
          comments: true,
          createdAt: true,
          updatedAt: true,
          approved: true,
          approvedBy: true,
          approvedAt: true,
        },
      });
      return timeEntries;
    }),
});
