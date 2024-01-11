import { getServerSession } from "next-auth/next";
import * as z from "zod";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";
import { AllocationFrequency } from "@prisma/client";

const allocationCreateSchema = z.object({
  team: z.string().min(1),
  projectId: z.coerce.number().min(1),
  userId: z.coerce.number().min(1),
  date: z.coerce.date(),
  frequency: z.nativeEnum(AllocationFrequency),
  enddate: z.coerce.date().optional(),
  billableTime: z.coerce.number(),
  nonBillableTime: z.coerce.number(),
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

    // check if the user has permission to the current team/workspace id if not return 403
    // user session has an object (name, id, slug, etc) of all workspaces the user has access to. i want to match slug.
    if (user.workspaces.filter((workspace) => workspace.slug === body.team).length === 0) {
      return new Response("Unauthorized", { status: 403 });
    }

    const client = await db.allocation.create({
      data: {
        date: body.date,
        enddate: body.enddate,
        frequency: body.frequency,
        billableTime: body.billableTime,
        nonBillableTime: body.nonBillableTime,
        Workspace: {
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
