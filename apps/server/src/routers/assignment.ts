import { z } from "zod";
import { router, protectedProcedure } from "../lib/trpc";
import { getAssignments, getAssignmentsByProject, createAssignment, deleteAssignment } from "../db/queries";

export const assignmentRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await getAssignments(ctx.session.activeOrganizationId!);
  }),
  getByProject: protectedProcedure.input(z.object({ projectId: z.number() })).query(async ({ input, ctx }) => {
    return await getAssignmentsByProject(ctx.session.activeOrganizationId!, input.projectId);
  }),
  create: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        memberId: z.string(),
        estimateItemId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await createAssignment(
        ctx.session.activeOrganizationId!,
        input.projectId,
        input.memberId,
        input.estimateItemId,
      );
    }),
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input, ctx }) => {
    return await deleteAssignment(ctx.session.activeOrganizationId!, input.id);
  }),
});
