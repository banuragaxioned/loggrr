import { z } from "zod";
import { router, protectedProcedure } from "../lib/trpc";
import { createProject, getProjectById, getProjects } from "../db/queries";

export const projectRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await getProjects(ctx.session.activeOrganizationId!);
  }),
  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input, ctx }) => {
    return await getProjectById(ctx.session.activeOrganizationId!, input.id);
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        clientId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await createProject(ctx.session.activeOrganizationId!, input.name, input.clientId);
    }),
});
