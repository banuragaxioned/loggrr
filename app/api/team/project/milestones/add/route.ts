import { getServerSession } from "next-auth/next";
import * as z from "zod";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";
import { ProjectInterval } from "@prisma/client";

const milestoneCreateSchema = z.object({
  budget: z.number().min(1),
  team: z.string().min(1),
  projectId: z.number().min(1),
  name: z.string().min(3).max(25),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    const json = await req.json();
    const body = milestoneCreateSchema.parse(json);

    // check if the user has permission to the current team/workspace id if not return 403
    // user session has an object (name, id, slug, etc) of all workspaces the user has access to. i want to match slug.
    if (user.workspaces.filter((workspace) => workspace.slug === body.team).length === 0) {
      return new Response("Unauthorized", { status: 403 });
    }

    const milestone = await db.milestone.create({
        data: {
            name: body.name,
            workspace: {
                connect: {
                    slug: body.team,
                },
            },
            project: {
                connect: {
                  id: body.projectId
                },
            },
            startDate: body.startDate,
            endDate: body.endDate,
            budget: body.budget,
        },
    });

    return new Response(JSON.stringify(milestone));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
