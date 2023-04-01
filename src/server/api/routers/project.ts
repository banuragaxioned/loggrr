import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const projectRouter = createTRPCRouter({
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

  // Get all Members for the current project
  getMembers: protectedProcedure
    .input(z.object({ projectId: z.string(), slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const projectId = input.projectId;
      const slug = input.slug;
      const members = await ctx.prisma.project.findMany({
        where: { Tenant: { slug }, id: +projectId },
        select: {
          Members: { select: { id: true, name: true, image: true } },
          Owner: { select: { id: true, name: true, image: true } },
        },
      });
      return members;
    }),

  // Add a new Member to the current project
  addMember: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const projectId = input.projectId;
      const userId = +input.userId;
      const member = await ctx.prisma.project.update({
        where: { id: +projectId },
        data: {
          Members: {
            connect: { id: userId },
          },
        },
      });
      return member;
    }),

  // Remove a Member from the current project
  removeMember: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const projectId = input.projectId;
      const userId = +input.userId;
      const member = await ctx.prisma.project.update({
        where: { id: +projectId },
        data: {
          Members: { disconnect: { id: userId } },
        },
      });
      return member;
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
