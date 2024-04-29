import { getServerSession } from "next-auth/next";
import * as z from "zod";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

const taskSchema = {
  name: z.string().min(3).max(50),
  budget: z.number().min(1),
  team: z.string().min(1),
  projectId: z.number().min(1),
};

const addTaskSchema = z.object(taskSchema);
const updateTaskSchema = z.object({ ...taskSchema, id: z.number().min(1) });

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized! You are not logged in." }, { status: 403 });
    }

    const { user } = session;

    const json = await req.json();
    const body = addTaskSchema.parse(json);

    // check if the user has permission to the current team/workspace id if not return 403
    // user session has an object (name, id, slug, etc) of all workspaces the user has access to. i want to match slug.
    if (user.workspaces.filter((workspace) => workspace.slug === body.team).length === 0) {
      return NextResponse.json({ error: "Unauthorized! Workspace not found." }, { status: 403 });
    }

    const tasks = await db.task.create({
      data: {
        name: body.name,
        workspace: {
          connect: {
            slug: body.team,
          },
        },
        project: {
          connect: {
            id: body.projectId,
          },
        },
        budget: body.budget,
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 });
    }

    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized! You are not logged in." }, { status: 403 });
    }

    const { user } = session;

    const { id, projectId, team } = await req.json();

    // check if the user has permission to the current team/workspace id if not return 403
    // user session has an object (name, id, slug, etc) of all workspaces the user has access to. i want to match slug.
    if (user.workspaces.filter((workspace) => workspace.slug === team).length === 0) {
      return NextResponse.json({ error: "Unauthorized! Workspace not found." }, { status: 403 });
    }

    const query = await db.task.delete({
      where: {
        id,
        projectId,
        workspace: {
          slug: team,
        },
      },
    });

    return NextResponse.json(query);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 });
    }

    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized! You are not logged in." }, { status: 403 });
    }

    const { user } = session;

    const json = await req.json();
    const body = updateTaskSchema.parse(json);

    // check if the user has permission to the current team/workspace id if not return 403
    // user session has an object (name, id, slug, etc) of all workspaces the user has access to. i want to match slug.
    if (user.workspaces.filter((workspace) => workspace.slug === body.team).length === 0) {
      return NextResponse.json({ error: "Unauthorized! Workspace not found." }, { status: 403 });
    }

    const client = await db.task.update({
      where: {
        id: body?.id,
      },
      data: {
        name: body?.name,
        budget: body?.budget,
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 });
    }

    return NextResponse.json({ error }, { status: 500 });
  }
}
