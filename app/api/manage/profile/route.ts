import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import * as z from "zod";

import { authOptions } from "@/server/auth";
import { db } from "@/server/db";

const userProfileSchema = {
  name: z.string().min(2).max(30),
  team: z.string().min(1),
  timezone: z.string().min(1),
};

const updateUserProfileSchema = z.object({ ...userProfileSchema, id: z.number().min(1) });

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized! You are not logged in." }, { status: 403 });
    }

    const { user } = session;

    const json = await req.json();
    const body = updateUserProfileSchema.parse(json);

     // check if the user has permission to the current team/workspace id if not return 403
    // user session has an object (name, id, slug, etc) of all workspaces the user has access to. i want to match slug.
    if (user.workspaces.filter((workspace) => workspace.slug === body.team).length === 0) {
      return NextResponse.json({ error: "Unauthorized! Workspace not found." }, { status: 403 });
    }

    const client = await db.user.update({
      where: {
        id: body?.id,
      },
      data: {
        name: body.name,
        timezone: body.timezone,
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
