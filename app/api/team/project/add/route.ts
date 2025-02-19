import { getServerSession } from "next-auth/next";
import * as z from "zod";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";
import { ProjectInterval } from "@prisma/client";

const projectCreateSchema = z.object({
  budget: z.number().optional(),
  team: z.string().min(1),
  name: z.string().min(3).max(50),
  clientId: z.number().min(1),
  ownerId: z.number().min(1),
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
        client: {
          connect: {
            id: body.clientId,
          },
        },
        workspace: {
          connect: {
            slug: body.team,
          },
        },
        owner: {
          connect: {
            id: body.ownerId,
          },
        },
        interval: body.interval,
        budget: body.budget,
        billable: body.billable ?? false,
      },
    });

    await db.usersOnProject.create({
      data: {
        project: {
          connect: {
            id: project.id,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
        workspace: {
          connect: {
            slug: body.team,
          },
        },
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

const projectEditSchema = z.object({
  id: z.number().min(1),
  budget: z.number().optional(),
  team: z.string().min(1),
  name: z.string().min(3).max(50),
  clientId: z.number().min(1),
  ownerId: z.number().min(1),
  interval: z.nativeEnum(ProjectInterval),
  billable: z.boolean().optional(),
});

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    const json = await req.json();
    const body = projectEditSchema.parse(json);

    if (user.workspaces.filter((workspace) => workspace.slug === body.team).length === 0) {
      return new Response("Unauthorized", { status: 403 });
    }

    const project = await db.project.update({
      where: {
        id: body.id,
      },
      data: {
        name: body.name,
        client: {
          connect: {
            id: body.clientId,
          },
        },
        workspace: {
          connect: {
            slug: body.team,
          },
        },
        owner: {
          connect: {
            id: body.ownerId,
          },
        },
        interval: body.interval,
        budget: body.budget,
        billable: body.billable ?? false,
      },
    });

    const userOnProject = await db.usersOnProject.findFirst({
      where: {
        projectId: +body.id,
        userId: +body.ownerId,
        workspace: {
          slug: body.team,
        },
      },
    });

    if (!userOnProject) {
      await db.usersOnProject.create({
        data: {
          project: {
            connect: {
              id: body.id,
            },
          },
          user: {
            connect: {
              id: user.id,
            },
          },
          workspace: {
            connect: {
              slug: body.team,
            },
          },
        },
      });
    }

    return new Response(JSON.stringify(project));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
