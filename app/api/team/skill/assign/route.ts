import { getServerSession } from "next-auth/next";
import * as z from "zod";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";

const addSkillSchema = z.object({
  team: z.string().min(1),
  skillId: z.coerce.number(),
  userId: z.coerce.number(),
  skillScore: z.coerce.number(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    const json = await req.json();
    const body = addSkillSchema.parse(json);

    // check if the user has permission to the current team/workspace id if not return 403
    // user session has an object (name, id, slug, etc) of all workspaces the user has access to. i want to match slug.
    if (user.workspaces.filter((workspace) => workspace.slug === body.team).length === 0) {
      return new Response("Unauthorized", { status: 403 });
    }

    const addSkill = await db.skillScore.create({
      data: {
        workspace: {
          connect: {
            slug: body.team,
          },
        },
        skill: {
          connect: {
            id: body.skillId,
          },
        },
        user: {
          connect: {
            id: body.userId,
          },
        },
        level: body.skillScore,
      },
    });

    return new Response(JSON.stringify(addSkill));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
