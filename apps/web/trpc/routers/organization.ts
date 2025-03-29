import { createTRPCRouter, protectedProcedure } from "../init";
import { auth } from "@workspace/auth";
import { headers } from "next/headers";
import { z } from "zod";

export const organizationRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async () => {
    const organizations = await auth.api.listOrganizations({
      headers: await headers(),
    });
    return organizations;
  }),
  setActive: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const organizations = await auth.api.setActiveOrganization({
        headers: await headers(),
        body: {
          organizationSlug: input.slug,
        },
      });
      return organizations;
    }),
  getMembers: protectedProcedure.query(async () => {
    const member = await auth.api.getActiveMember({
      headers: await headers(),
    });
    return member;
  }),
  getTeams: protectedProcedure.query(async () => {
    const teams = await auth.api.listOrganizationTeams({
      headers: await headers(),
    });
    return teams;
  }),
});
