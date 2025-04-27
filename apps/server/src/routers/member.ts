import { router, protectedProcedure } from "../lib/trpc";
import { member, user } from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

export const memberRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const members = await db
      .select({
        id: member.id,
        organizationId: member.organizationId,
        userId: member.userId,
        role: member.role,
        createdAt: member.createdAt,
        user: {
          name: user.name,
          email: user.email,
          image: user.image,
        },
      })
      .from(member)
      .innerJoin(user, eq(member.userId, user.id))
      .where(eq(member.organizationId, ctx.session.session.activeOrganizationId!));

    return members;
  }),
});
