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

  getAll2: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.tenant.findMany();
  }),

  //get all tenants that the current user is a member of
  getTenants: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.tenant.findMany();
  }),
});

export const TenantList = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.tenant.findMany();
  }),
});

