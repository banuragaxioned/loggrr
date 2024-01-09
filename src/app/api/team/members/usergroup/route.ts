import { getServerSession } from "next-auth/next";
import * as z from "zod";
import { authOptions } from "@/server/auth";
import { db } from "@/lib/db";

const groupSchema = z.object({ id: z.number() });

const updateUserGroupSchema = z.object({
  team: z.string().min(1),
  groups: z.array(groupSchema),
  userId: z.number().min(1),
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

    // check if the user has permission to the current team/workspace id if not return 403
    // user session has an object (name, id, slug, etc) of all workspaces the user has access to. i want to match slug.
    const isNotTeamMember = user.workspaces.filter((workspace) => workspace.slug === body.team).length === 0;

    if (isNotTeamMember) {
      return new Response("Unauthorized", { status: 403 });
    }

    const connectedGroups = await db.user.findUnique({
      where: { id: body.userId },
      select: {
        UserGroup: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!connectedGroups) {
      return new Response("User not found", { status: 403 });
    }

    const flatConnectedGroups = connectedGroups.UserGroup;

    let updatedUserGroupIds;

    let isConnect = false;

    const difference = (bigArray: { id: number }[], smallArray: { id: number }[]) =>
      bigArray.filter((obj1) => !smallArray.some((obj2) => obj1.id === obj2.id));

    if (flatConnectedGroups.length > body.groups.length) {
      isConnect = false;
      updatedUserGroupIds = difference(flatConnectedGroups, body.groups);
    } else {
      isConnect = true;
      updatedUserGroupIds = difference(body.groups, flatConnectedGroups);
    }

    const updateUserGroup = updatedUserGroupIds.map(async (group) => {
      const userGroup = await db.user.update({
        where: { id: body.userId },
        data: {
          UserGroup: {
            [isConnect ? "connect" : "disconnect"]: { id: group.id },
          },
        },
      });

      return userGroup;
    });

    return new Response(JSON.stringify(updateUserGroup));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
