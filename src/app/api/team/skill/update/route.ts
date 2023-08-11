import { getServerSession } from "next-auth/next";
import * as z from "zod";
import { authOptions } from "@/server/auth";
import { db } from "@/lib/db";

const clientCreateSchema = z.object({
  userId: z.number().positive().min(1),
  skillId: z.number().positive().min(1),
  level: z.number().min(0).max(5),
  team: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    const json = await req.json();
    const body = clientCreateSchema.parse(json);

    // check if the user has permission to the current team/tenant id if not return 403
    // user session has an object (name, id, slug, etc) of all tenants the user has access to. i want to match slug.
    if (user.tenants.filter((tenant) => tenant.slug === body.team).length === 0) {
      return new Response("Unauthorized", { status: 403 });
    }

    const client = await db.skillScore.updateMany({
      where: {
        Tenant: {
          slug: body.team,
        },
        User: {
          id: body.userId,
        },
        Skill: {
          id: body.skillId,
        },
      },
      data: {
        level: body.level,
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
