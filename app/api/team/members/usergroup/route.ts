import { Workspace } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import * as z from "zod";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";

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
    const isMember = user.workspaces.filter((workspace) => workspace.slug === body.team).length === 1;

    if (!isMember) {
      return new Response("Unauthorized", { status: 403 });
    }

    // get users current groups
    const currentGroups = await db.userOnGroup.findMany({
      where: {
        userId: body.userId,
        workspace: {
          slug: body.team,
        },
      },
      select: { groupId: true },
    });

    // get the new groups that don't exist in the current groups
    const newGroups = body.groups.filter((group) => {
      return !currentGroups.some((currentGroup) => currentGroup.groupId === group.id);
    });

    // get the removed groups that exist in the current groups
    const removedGroups = currentGroups.filter((currentGroup) => {
      return !body.groups.some((group) => group.id === currentGroup.groupId);
    });

    const updateGroups = await db.$transaction([
      ...newGroups.map((group) => {
        return db.userOnGroup.create({
          data: {
            group: {
              connect: {
                id: group.id,
              },
            },
            user: {
              connect: {
                id: body.userId,
              },
            },
            workspace: {
              connect: {
                slug: body.team,
              },
            },
          },
        });
      }),
      ...removedGroups.map((group) => {
        return db.userOnGroup.delete({
          where: {
            userId_groupId: {
              groupId: group.groupId,
              userId: body.userId,
            },
          },
        });
      }),
    ]);

    return new Response(JSON.stringify(updateGroups));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
