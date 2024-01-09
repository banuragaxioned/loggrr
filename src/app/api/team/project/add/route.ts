import { getServerSession } from "next-auth/next";
import * as z from "zod";
import { authOptions } from "@/server/auth";
import { db } from "@/lib/db";
import { ProjectInterval } from "@prisma/client";

const projectCreateSchema = z.object({
  budget: z.number().min(1),
  team: z.string().min(1),
  name: z.string().min(3).max(25),
  clientId: z.number().min(1),
  ownerId: z.number().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  interval: z.nativeEnum(ProjectInterval),
  billable: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    const json = await req.json();
    const body = projectCreateSchema.parse(json);

    // check if the user has permission to the current team/workspace id if not return 403
    // user session has an object (name, id, slug, etc) of all workspaces the user has access to. i want to match slug.
    if (user.workspaces.filter((workspace) => workspace.slug === body.team).length === 0) {
      return new Response("Unauthorized", { status: 403 });
    }

    const project = await db.project.create({
      data: {
        name: body.name,
        Client: {
          connect: {
            id: body.clientId,
          },
        },
        Workspace: {
          connect: {
            slug: body.team,
          },
        },
        Owner: {
          connect: {
            id: body.ownerId,
          },
        },
        Members: {
          connect: {
            id: body.ownerId,
          },
        },
        startdate: body.startDate,
        enddate: body.endDate,
        interval: body.interval,
        budget: body.budget,
      },
    });

    return new Response(JSON.stringify(project));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
