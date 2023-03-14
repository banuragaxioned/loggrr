import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const tenantRouter = createTRPCRouter({
  myTenants: protectedProcedure.query(async ({ ctx }) => {
    const userId = Number(ctx.session.user.id);
    // TODO: Need to fix the @/server/auth.ts
    const tenants = await ctx.prisma.tenant.findMany({
      where: { users: { some: { id: userId } } },
    });
    return tenants;
  }),
});
