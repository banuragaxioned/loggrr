import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const skillsRouter = createTRPCRouter({
  // Get all available skills for the current tenant
  getAllSkills: protectedProcedure.input(z.object({ tenant: z.string() })).query(async ({ ctx, input }) => {
    const slug = input.tenant;
    const skills = await ctx.prisma.skill.findMany({
      where: { Tenant: { slug: slug } },
    });
    return skills;
  }),

  // Get the skills scores for the current user, for the current tenant
  getMySkillsScores: protectedProcedure.input(z.object({ tenant: z.string() })).query(async ({ ctx, input }) => {
    const slug = input.tenant;
    const userId = Number(ctx.session.user.id);
    const skillScores = await ctx.prisma.skillScore.findMany({
      where: { User: { id: userId }, Tenant: { slug: slug } },
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
  getAllSkillsScores: protectedProcedure.input(z.object({ tenant: z.string() })).query(async ({ ctx, input }) => {
    const slug = input.tenant;
    const skillScores = await ctx.prisma.skillScore.findMany({
      where: { Tenant: { slug: slug } },
      include: { Skill: true, User: true },
    });
    const mappedScores = skillScores.map((score) => {
      return {
        id: score.id,
        skill: score.Skill.name,
        level: score.skillLevel,
        user: score.User.name,
      };
    });
    return mappedScores;
  }),
  // Create a skill in the current tenant
  createSkill: protectedProcedure
    .input(z.object({ slug: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const slug = input.slug;
      const skillName = input.name;
      const newSkill = await ctx.prisma.skill.create({
        data: {
          name: skillName,
          Tenant: {
            connect: { slug },
          },
        },
      });
      return newSkill;
    }),
});
