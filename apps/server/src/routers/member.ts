import { router, protectedProcedure } from "../lib/trpc";
import { getMembers } from "../db/queries";

export const memberRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await getMembers(ctx.session.activeOrganizationId!);
  }),
});
