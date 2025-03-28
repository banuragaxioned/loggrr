import { createTRPCRouter, protectedProcedure } from "../init";

export const userRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => {
    return {
      user: ctx.session.user,
    };
  }),
});
