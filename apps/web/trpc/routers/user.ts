import { createTRPCRouter, protectedProcedure } from "../init";
import { auth } from "@workspace/auth";
import { headers } from "next/headers";

export const userRouter = createTRPCRouter({
  getCurrent: protectedProcedure.query(({ ctx }) => {
    return {
      user: ctx.session.user,
    };
  }),
  listSessions: protectedProcedure.query(async () => {
    const sessions = await auth.api.listSessions({
      headers: await headers(),
    });
    return sessions;
  }),
});
