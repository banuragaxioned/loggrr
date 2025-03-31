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
        slug: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      await auth.api.setActiveOrganization({
        headers: await headers(),
        body: {
          organizationSlug: input.slug,
        },
      });
    }),
  currentMember: protectedProcedure.query(async () => {
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
