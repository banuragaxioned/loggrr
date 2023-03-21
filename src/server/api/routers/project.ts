import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
  // Get all Clients for the current tenant
  getClients: protectedProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ ctx, input }) => {
      const slug = input.text;
      const userId = Number(ctx.session.user.id);
      const clients = await ctx.prisma.tenant.findFirst({
        where: { slug, users: { some: { id: userId } } },
        include: { client: true },
      });
      return clients;
    }),

  // Get all Projects for the current tenant
  getProjects: protectedProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ ctx, input }) => {
      const slug = input.text;
      const userId = Number(ctx.session.user.id);
      const clients = await ctx.prisma.tenant.findFirst({
        where: { slug, users: { some: { id: userId } } },
        include: { project: true },
      });
      return clients;
    }),
});
