import { getServerSession } from "next-auth/next";
import * as z from "zod";
import { authOptions } from "@/server/auth";
import { db } from "@/lib/db";

const updateUserGroupSchema = z.object({
  team: z.string().min(1),
  addUserGroup: z.number().optional(),
  removeUserGroup: z.number().optional(),
  userId: z.number().min(1)
});

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    const json = await req.json();
    const body = updateUserGroupSchema.parse(json);

    // check if the user has permission to the current team/tenant id if not return 403
    // user session has an object (name, id, slug, etc) of all tenants the user has access to. i want to match slug.
    const isNotTeamMember = user.tenants.filter((tenant) => tenant.slug === body.team).length === 0;

    if (isNotTeamMember) {
      return new Response("Unauthorized", { status: 403 });
    }

    let userGroup;

    if(body.addUserGroup) {
      userGroup = await db.user.update({
        where: { id: body.userId },
        data: {
          UserGroup: {
            connect: { id: body.addUserGroup }
          }
        },
      });
    } else if (body.removeUserGroup) {
      userGroup = await db.user.update({
        where: { id: body.userId },
        data: {
          UserGroup: {
            disconnect: { id: body.removeUserGroup }
          }
        },
      });
    }


    return new Response(JSON.stringify(userGroup));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
