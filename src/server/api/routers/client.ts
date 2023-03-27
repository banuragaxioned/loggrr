import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const clientRouter = createTRPCRouter({
  // Get all Clients for the current tenant
  getClients: protectedProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ ctx, input }) => {
      const slug = input.text;
      const clients = await ctx.prisma.client.findMany({
        where: { Tenant: { slug: slug} },
      });
      return clients;
    }),

  // Create a new Client
  createClient: protectedProcedure
    .input(z.object({ slug: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const slug = input.slug;
      const clientName = input.name;
      const client = await ctx.prisma.client.create({
        data: {
          name: clientName,
          Tenant: {
            connect: { slug },
          },
        },
      });
      return client;
    }),
});
