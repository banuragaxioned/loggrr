import { createTRPCRouter, protectedProcedure } from "../init";

export const testRouter = createTRPCRouter({
  getCurrentUser: protectedProcedure.query(({ ctx }) => {
    return {
      user: ctx.session.user,
    };
  }),
});
