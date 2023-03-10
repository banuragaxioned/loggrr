import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const tenantRouter = createTRPCRouter({

  myTenants: protectedProcedure.query(async ({ ctx }) => {
    const tenants = await ctx.prisma.tenant.findMany({
      where: { users: { some: { id: "cled1r2tz0000uhyg5k0p0zrg" } } },
    });
    return tenants;
  }),

});
