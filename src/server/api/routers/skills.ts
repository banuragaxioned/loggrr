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
        include: { SkillScore: true },
      });
      return skills;
    }),

  // Get all skills for a user, for the current tenant

  // Get all skills for all users, for the current tenant

  // Create a skill in the current tenant - least priority
});
