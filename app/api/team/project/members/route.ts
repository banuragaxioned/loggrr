import { getServerSession } from "next-auth/next";
import * as z from "zod";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

const projectMemberSchema = {
  team: z.string().min(1),
  projectId: z.number(),
  userId: z.number().min(1),
};

const addProjectMemberSchema = z.object(projectMemberSchema);
const deleteProjectMemberSchema = z.object({ ...projectMemberSchema, id: z.number().min(1) });

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized! You are not logged in." }, { status: 403 });
    }

    const { user } = session;

    const json = await req.json();
    const body = addProjectMemberSchema.parse(json);

    // check if the user has permission to the current team/workspace id if not return 403
    // user session has an object (name, id, slug, etc) of all workspaces the user has access to. i want to match slug.
    if (user.workspaces.filter((workspace) => workspace.slug === body.team).length === 0) {
      return NextResponse.json({ error: "Unauthorized! Workspace not found." }, { status: 403 });
    }

    const userDetails = await db.user.findUnique({
      where: {
        id: body.userId,
        workspaces: {
          some: {
            workspace: {
              slug: body.team,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    const addMember =
      userDetails &&
      (await db.project.update({
        where: {
          id: body.projectId,
        },
        data: {
          usersOnProject: {
            create: {
              user: {
                connect: {
                  id: userDetails.id,
                },
              },
              workspace: {
                connect: {
                  slug: body.team,
                },
              },
            },
          },
        },
      }));

    return NextResponse.json(addMember);
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

    const { userId, projectId, team } = await req.json();
    
    // check if the user has permission to the current team/workspace id if not return 403
    // user session has an object (name, id, slug, etc) of all workspaces the user has access to. i want to match slug.
    if (user.workspaces.filter((workspace) => workspace.slug === team).length === 0) {
      return NextResponse.json({ error: "Unauthorized! Workspace not found." }, { status: 403 });
    }

    const deleteMember = await db.usersOnProject.delete({
      where: {
        id: userId,
        projectId: +projectId,
        workspace: {
          slug: team,
        },
      },
    });

    return NextResponse.json(deleteMember);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 });
    }

    return NextResponse.json({ error }, { status: 500 });
  }
}
