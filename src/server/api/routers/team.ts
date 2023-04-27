import { Status } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const teamRouter = createTRPCRouter({
  // Get all Teams for the current user
  myTeams: protectedProcedure.query(async ({ ctx }) => {
    const userId = Number(ctx.session.user.id);
    // TODO: Need to fix the @/server/auth.ts
    const teams = await ctx.prisma.tenant.findMany({
      where: {
        Users: { some: { id: userId } },
        status: Status.PUBLISHED,
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: { name: "asc" },
    });
    return teams;
  }),
  // Get a single Team by slug
  // TODO: Need to move this to the middleware? (see comment on src/server/api/trpc.ts; enforceUserIsAuthorized)
  validateTeamAccess: protectedProcedure.input(z.object({ text: z.string() })).query(async ({ ctx, input }) => {
    const slug = input.text;
    const userId = Number(ctx.session.user.id);
    const team = await ctx.prisma.tenant.findFirst({
      where: { slug, Users: { some: { id: userId } } }, // This works as an OR filter?
    });
    return team;
  }),

  // Get all members for a Team
  getTeamMembers: protectedProcedure.input(z.object({ slug: z.string() })).query(async ({ ctx, input }) => {
    const slug = input.slug;

    const members = await ctx.prisma.tenant.findUnique({
      where: { slug: slug },
      select: {
        Users: {
          orderBy: { name: "asc" },
        },
      },
    });

    return members?.Users || [];
  }),

  // connect user to tenant
  connectUserToTenant: protectedProcedure
    .input(
      z.object({
        tenant: z.string(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userEmail = input.email;

      const tenant = await ctx.prisma.tenant.findUnique({
        where: { slug: input.tenant },
      });

      if (!tenant) {
        throw new Error("Tenant not found");
      }

      const user = await ctx.prisma.user.findUnique({
        where: { email: userEmail },
      });

      // TODO: Invite user to tenant if not found
      if (!user) {
        throw new Error("User not found");
      }

      const connectUser = await ctx.prisma.tenant.update({
        where: { id: tenant.id },
        data: {
          Users: {
            connect: { id: user.id },
          },
        },
      });

      return connectUser;
    }),
});
