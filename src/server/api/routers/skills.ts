import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const skillsRouter = createTRPCRouter({
  // Get all available skills for the current tenant
  getAllSkills: protectedProcedure
    .input(z.object({ tenant: z.string() }))
    .query(async ({ ctx, input }) => {
      const slug = input.tenant;
      const userId = Number(ctx.session.user.id);
      const skills = await ctx.prisma.tenant.findFirst({
        where: { slug, Users: { some: { id: userId } } },
        include: { Skill: true },
      });
      return skills;
    }),

  // Get the skills scores for the current user, for the current tenant
  getMySkillsScores: protectedProcedure
    .input(z.object({ tenant: z.string() }))
    .query(async ({ ctx, input }) => {
      const slug = input.tenant;
      const userId = Number(ctx.session.user.id);
      const skillScores = await ctx.prisma.tenant.findFirst({
        where: { slug, Users: { some: { id: userId } } },
        // TODO: this needs to also filter the resutls for the current user
        include: { SkillScore: true, Skill: true },
      });
      return skillScores;
    }),

  // Get all skills for all users, for the current tenant
  getAllSkillsScores: protectedProcedure
    .input(z.object({ tenant: z.string() }))
    .query(async ({ ctx, input }) => {
      const slug = input.tenant;
      const userId = Number(ctx.session.user.id);
      const skillScores = await ctx.prisma.tenant.findFirst({
        where: { slug, Users: { some: { id: userId } } },
        include: { SkillScore: true, Skill: true },
      });
      return skillScores;
    }),
  // Create a skill in the current tenant - least priority
});
