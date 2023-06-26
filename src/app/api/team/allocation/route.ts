import { getServerSession } from "next-auth/next";
import * as z from "zod";
import { authOptions } from "@/server/auth";
import { db } from "@/lib/db";
import { AllocationFrequency } from "@prisma/client";

const allocationCreateSchema = z.object({
  team: z.string(),
  projectId: z.number(),
  userId: z.number(),
  date: z.date(),
  frequency: z.nativeEnum(AllocationFrequency),
  enddate: z.date().optional(),
  billableTime: z.number(),
  nonBillableTime: z.number(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    const json = await req.json();
    const body = allocationCreateSchema.parse(json);

    // check if the user has permission to the current team/tenant id if not return 403
    // user session has an object (name, id, slug, etc) of all tenants the user has access to. i want to match slug.
    if (user.tenants.filter((tenant) => tenant.slug === body.team).length === 0) {
      return new Response("Unauthorized", { status: 403 });
    }

    const client = await db.allocation.create({
      data: {
        date: body.date,
        enddate: body.enddate,
        billableTime: body.billableTime,
        frequency: body.frequency,
        nonBillableTime: body.nonBillableTime,
        Tenant: {
          connect: { slug: body.team },
        },
        Project: {
          connect: { id: body.projectId },
        },
        User: {
          connect: { id: body.userId },
        },
      },
    });

    return new Response(JSON.stringify(client));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
