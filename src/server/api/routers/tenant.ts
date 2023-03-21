import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

type dataType = {
  input: string;
};

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
  // TODO: Need to move this to the middleware? (see comment on src/server/api/trpc.ts; enforceUserIsAuthorized)
  validateTenantAccess: protectedProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ ctx, input }) => {
      const slug = input.text;
      const userId = Number(ctx.session.user.id);
      const tenant = await ctx.prisma.tenant.findFirst({
        where: { slug, users: { some: { id: userId } } }, // This works as an OR filter?
      });
      return tenant;
    }),
  // Get all members for a Tenant
  getTenantMembers: protectedProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ ctx, input }) => {
      const slug = input.text;
      const userId = Number(ctx.session.user.id);
      const members = await ctx.prisma.tenant.findFirst({
        where: { slug, users: { some: { id: userId } } },
        include: { users: true },
        // select: { users: { select: { id: true, name: true, image: true } } },
      });
      return members;
    }),
  getTenantClients: protectedProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ ctx, input }) => {
      const slug = input.text;
      const userId = Number(ctx.session.user.id);
      const clients = await ctx.prisma.tenant.findFirst({
        where: { slug, users: { some: { id: userId } } },
        include: { client: true },
        // select: { users: { select: { id: true, name: true, image: true } } },
      });
      return clients;
    }),
});
