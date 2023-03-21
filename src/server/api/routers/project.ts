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

  // Create a new Client
  createClient: protectedProcedure
    .input(z.object({ slug: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const slug = input.slug;
      const projectName = input.name;
      const client = await ctx.prisma.client.create({
        data: {
          name: projectName,
          tenant: {
            connect: { slug },
          },
        },
      });
      return client;
    }
  ),

  // Create a new Project
  // createProject: protectedProcedure
  //   .input(z.object({ slug: z.string(), pname: z.string(), cid: z.number(), startdate: z.date(), interval: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const slug = input.slug;
  //     const clientId = input.cid;
  //     const projectName = input.pname;
  //     const startdate = input.startdate;
  //     const interval = input.interval;
  //     const project = await ctx.prisma.project.create({
  //       data: {
  //         name: projectName,
  //         client: clientId,
  //         ownerId: 1,
  //         startdate: startdate,
  //         interval: interval,
  //         tenant: {
  //           connect: { slug },
  //         },
  //       },
  //     });
  //     return project;
  //   }
  // ),
});
