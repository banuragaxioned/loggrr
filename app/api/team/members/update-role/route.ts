import { getServerSession } from "next-auth/next";
import * as z from "zod";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";
import { Role } from "@prisma/client";

const updateRoleSchema = z.object({
  team: z.string().min(1),
  userId: z.number().min(1),
  role: z.string().min(1),
});

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    const json = await req.json();
    const body = updateRoleSchema.parse(json);

    // check if the user has permission to the current team/workspace id if not return 403
    // user session has an object (name, id, slug, etc) of all workspaces the user has access to. i want to match slug.
    if (user.workspaces.filter((workspace) => workspace.slug === body.team).length === 0) {
      return new Response("Unauthorized", { status: 403 });
    }

    await db.userWorkspace.updateMany({
      where: {
        workspace: {
          slug: body.team,
        },
        userId: body.userId,
      },
      data: {
        role: body.role as Role,
      },
    });

    const response = { message: `User is now ${body.role}` };

    return new Response(JSON.stringify(response));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
