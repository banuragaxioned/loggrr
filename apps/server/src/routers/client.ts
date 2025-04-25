import { z } from "zod";
import { router, protectedProcedure } from "../lib/trpc";
import { client } from "../db/schema";
import { db } from "../db";
import { auth } from "../lib/auth";

export const clientRouter = router({
  getAll: protectedProcedure.query(async () => {
    return await db.select().from(client);
  }),
  create: protectedProcedure.input(z.object({ name: z.string().min(1) })).mutation(async ({ input, ctx }) => {
    const hasPermission = await auth.api.hasPermission({
      body: {
        organizationId: ctx.session.session.activeOrganizationId!,
        permissions: {
          organization: ["update"],
        },
      },
      headers: {
        "x-api-key": ctx.session.session.token,
      },
    });

    if (!hasPermission) {
      throw new Error("You do not have permission to create a client");
    }

    return await db.insert(client).values({
      name: input.name,
      organizationId: ctx.session.session.activeOrganizationId!,
    });
  }),
});
