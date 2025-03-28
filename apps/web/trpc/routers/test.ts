import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const testRouter = createTRPCRouter({
  hello: protectedProcedure.input(z.object({ name: z.string().optional() })).query(({ input, ctx }) => {
    return {
      greeting: `Hello ${input.name}! (from ${ctx.session.user.name})`,
    };
  }),
});
