import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const tenantRouter = createTRPCRouter({
  // Get all Tenants for the current user
  myTenants: protectedProcedure.query(async ({ ctx }) => {
    const userId = Number(ctx.session.user.id);
    // TODO: Need to fix the @/server/auth.ts
    const tenants = await ctx.prisma.tenant.findMany({
      where: { users: { some: { id: userId } } },
    });
    return tenants;
  }),
  // Get a single Tenant by slug
  getTenantDetails: protectedProcedure.query(async ({ ctx, input }) => {
    const slug = input;
    const userId = Number(ctx.session.user.id);
    const tenant = await ctx.prisma.tenant.findFirst({
      where: { slug, users: { some: { id: userId } } },
    });
    return tenant;
  }),
});
