import { z } from "zod";
import { router, protectedProcedure } from "../lib/trpc";
import { getClients, createClient } from "@/db/queries";

export const clientRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await getClients(ctx.session.activeOrganizationId!);
  }),
  create: protectedProcedure.input(z.object({ name: z.string().min(1) })).mutation(async ({ input, ctx }) => {
    return await createClient(ctx.session.activeOrganizationId!, input.name);
  }),
});
