import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const skillsRouter = createTRPCRouter({
  // Get all available skills for the current tenant
  getAllSkills: protectedProcedure
    .input(z.object({ tenant: z.string() }))
    .query(async ({ ctx, input }) => {
      const slug = input.tenant;
      const skills = await ctx.prisma.skill.findMany({
        where: { Tenant: { slug: slug} },
      });
      return skills;
    }),

  // Get the skills scores for the current user, for the current tenant
  getMySkillsScores: protectedProcedure
    .input(z.object({ tenant: z.string() }))
    .query(async ({ ctx, input }) => {
      const slug = input.tenant;
      const userId = Number(ctx.session.user.id);
      const skillScores = await ctx.prisma.skillScore.findMany({
        where: { User: { id: userId }, Tenant: { slug: slug} },
        include: { Skill: true },
      });
      const mappedSkills = skillScores.map((skillScore) => {
        return {
          id: skillScore.id,
          skill: skillScore.Skill.name,
          level: skillScore.skillLevel,
        };
      });
      return mappedSkills;
    }),

  // Get all skills for all users, for the current tenant
  getAllSkillsScores: protectedProcedure
    .input(z.object({ tenant: z.string() }))
    .query(async ({ ctx, input }) => {
      const slug = input.tenant;
      const skillScores = await ctx.prisma.skillScore.findMany({
        where: { Tenant: { slug: slug} },
        include: { Skill: true, User: true },
      });
      return skillScores;
    }),
  // Create a skill in the current tenant - least priority
});
