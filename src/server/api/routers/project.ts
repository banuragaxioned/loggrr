import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
  // Get all Clients for the current tenant
  getClients: protectedProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ ctx, input }) => {
      const slug = input.text;
      const clients = await ctx.prisma.client.findMany({
        where: { Tenant: { slug: slug } },
      });
      return clients;
    }),

  // Get all Projects for the current tenant
  getProjects: protectedProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ ctx, input }) => {
      const slug = input.text;
      const projects = await ctx.prisma.project.findMany({
        where: { Tenant: { slug: slug } },
      });
      return projects;
    }),

  // Create a new Project
  createProject: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        name: z.string(),
        clientId: z.number(),
        startdate: z.date(),
        enddate: z.date().optional(),
        billable: z.boolean(),
        interval: z.enum([
          "FIXED",
          "WEEKLY",
          "MONTHLY",
          "QUARTERLY",
          "HALFYEARLY",
          "YEARLY",
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const slug = input.slug;
      const clientId = input.clientId;
      const projectName = input.name;
      const startdate = input.startdate;
      const interval = input.interval;
      const enddate = input.enddate;
      const billable = input.billable;
      const project = await ctx.prisma.project.create({
        data: {
          name: projectName,
          startdate: startdate,
          enddate: enddate,
          interval: interval,
          billable: billable,
          Client: {
            connect: { id: clientId },
          },
          Tenant: {
            connect: { slug },
          },
          Owner: {
            connect: { id: ctx.session.user.id },
          },
        },
      });
      return project;
    }),
});
