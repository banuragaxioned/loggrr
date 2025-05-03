import { z } from "zod";
import { router, protectedProcedure } from "../lib/trpc";
import { db } from "../db";
import { assignment, project, member, user, estimateItem, skill } from "../db/schema";
import { eq, and } from "drizzle-orm";

export const assignmentRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await db
      .select({
        id: assignment.id,
        projectId: assignment.projectId,
        projectName: project.name,
        memberId: assignment.memberId,
        memberName: user.name,
        estimateItemId: assignment.estimateItemId,
        skillName: skill.name,
        duration: estimateItem.duration,
        rate: estimateItem.rate,
        currency: estimateItem.currency,
        organizationId: assignment.organizationId,
        createdById: assignment.createdById,
        updatedById: assignment.updatedById,
        createdAt: assignment.createdAt,
        updatedAt: assignment.updatedAt,
      })
      .from(assignment)
      .innerJoin(project, eq(assignment.projectId, project.id))
      .innerJoin(member, eq(assignment.memberId, member.id))
      .innerJoin(user, eq(member.userId, user.id))
      .innerJoin(estimateItem, eq(assignment.estimateItemId, estimateItem.id))
      .innerJoin(skill, eq(estimateItem.skillId, skill.id))
      .where(eq(assignment.organizationId, ctx.session.activeOrganizationId!));
  }),

  getByProject: protectedProcedure.input(z.object({ projectId: z.number() })).query(async ({ input, ctx }) => {
    return await db
      .select({
        id: assignment.id,
        projectId: assignment.projectId,
        projectName: project.name,
        memberId: assignment.memberId,
        memberName: user.name,
        estimateItemId: assignment.estimateItemId,
        skillName: skill.name,
        duration: estimateItem.duration,
        rate: estimateItem.rate,
        currency: estimateItem.currency,
        organizationId: assignment.organizationId,
        createdById: assignment.createdById,
        updatedById: assignment.updatedById,
        createdAt: assignment.createdAt,
        updatedAt: assignment.updatedAt,
      })
      .from(assignment)
      .innerJoin(project, eq(assignment.projectId, project.id))
      .innerJoin(member, eq(assignment.memberId, member.id))
      .innerJoin(user, eq(member.userId, user.id))
      .innerJoin(estimateItem, eq(assignment.estimateItemId, estimateItem.id))
      .innerJoin(skill, eq(estimateItem.skillId, skill.id))
      .where(
        and(
          eq(assignment.organizationId, ctx.session.activeOrganizationId!),
          eq(assignment.projectId, input.projectId),
        ),
      );
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
      return await db.insert(assignment).values({
        organizationId: ctx.session.activeOrganizationId!,
        projectId: input.projectId,
        memberId: input.memberId,
        estimateItemId: input.estimateItemId,
        createdById: input.memberId,
        updatedById: input.memberId,
      });
    }),

  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input, ctx }) => {
    return await db
      .delete(assignment)
      .where(and(eq(assignment.id, input.id), eq(assignment.organizationId, ctx.session.activeOrganizationId!)));
  }),
});
