import { getServerSession } from "next-auth/next";
import * as z from "zod";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";

const addUserSchema = z.object({
  team: z.string().min(1),
  projectId: z.number(),
  user: z.number().min(1),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    const json = await req.json();
    const body = addUserSchema.parse(json);

    // check if the user has permission to the current team/workspace id if not return 403
    // user session has an object (name, id, slug, etc) of all workspaces the user has access to. i want to match slug.
    if (user.workspaces.filter((workspace) => workspace.slug === body.team).length === 0) {
      return new Response("Unauthorized", { status: 403 });
    }

    const userDetails = await db.user.findUnique({
      where: {
        id: body.user,
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

    const project =
      userDetails &&
      (await db.project.update({
        where: {
          id: body.projectId,
        },
        data: {
          UsersOnProject: {
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

    return new Response(JSON.stringify(project));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
