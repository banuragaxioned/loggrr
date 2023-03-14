import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const tenantRouter = createTRPCRouter({
  myTenants: protectedProcedure.query(async ({ ctx }) => {
    const tenants = await ctx.prisma.tenant.findMany({
      // TODO: fix the tenant id
      where: { users: { some: { id: 1 } } },
    });
    return tenants;
  }),
});
