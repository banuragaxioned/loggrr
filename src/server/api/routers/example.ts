import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  myTenants: protectedProcedure.query(async ({ ctx }) => {
    const tenants = await ctx.prisma.tenant.findMany({
      where: { users: { some: { id: 'cled1r2tz0000uhyg5k0p0zrg' } } },
    });
    return tenants;
  }),

});