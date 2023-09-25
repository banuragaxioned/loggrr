import { getServerSession } from "next-auth/next";
import * as z from "zod";
import { authOptions } from "@/server/auth";
import { db } from "@/lib/db";
import { getDifferenceBetweenTwoArray } from "@/lib/utils";

const groupSchema = z.object({ id: z.number() })

const updateUserGroupSchema = z.object({
  team: z.string().min(1),
  groups: z.array(groupSchema),
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

    const connectedGroups = await db.user.findMany({
      where: { id: body.userId },
      select: {
        UserGroup: {
          select: {
            id: true,
          }
        }
      }
    })

    const flatConnectedGroups = connectedGroups[0].UserGroup

    let updatedUserGroupIds;

    let isConnect = false;

    if (flatConnectedGroups.length > body.groups.length) {
      isConnect = false;
      updatedUserGroupIds = getDifferenceBetweenTwoArray(flatConnectedGroups, body.groups);
    } else {
      isConnect = true;
      updatedUserGroupIds = getDifferenceBetweenTwoArray(body.groups, flatConnectedGroups);
    }

    const updateUserGroup = updatedUserGroupIds.map(async (group) => {
      const userGroup = await db.user.update({
        where: { id: body.userId },
        data: {
          UserGroup: {
            [isConnect ? 'connect' : 'disconnect']: { id: group.id }
          }
        },
      });

      return userGroup;
    })

    return new Response(JSON.stringify(updateUserGroup));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}