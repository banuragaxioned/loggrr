"use server";

import { getCurrentUser } from "@/server/session";
import { checkAccess, getUserRole } from "@/lib/helper";
import { Role } from "@/generated/prisma/browser";
import { db } from "@/server/db";

async function assertCanManageGroups(team: string) {
  const user = await getCurrentUser();
  if (!user) return false;

  const role = getUserRole(user.workspaces, team);
  return checkAccess(role, [Role.MANAGER, Role.OWNER], "allow");
}

export async function createGroup(team: string, groupName: string) {
  if (!(await assertCanManageGroups(team))) {
    return { success: false };
  }

  try {
    await db.group.create({
      data: {
        name: groupName,
        workspace: {
          connect: {
            slug: team,
          },
        },
      },
    });
  } catch {
    throw new Error("Failed to create group");
  }

  return { success: true };
}

export async function updateGroup(team: string, id: number, name: string) {
  if (!(await assertCanManageGroups(team))) {
    return { success: false };
  }

  await db.group.update({
    where: {
      id,
      workspace: {
        slug: team,
      },
    },
    data: { name },
  });

  return { success: true };
}

export async function deleteGroup(team: string, id: number) {
  if (!(await assertCanManageGroups(team))) {
    return { success: false };
  }

  const group = await db.group.findFirst({
    where: {
      id,
      workspace: {
        slug: team,
      },
    },
    select: {
      _count: {
        select: {
          userOnGroup: true,
        },
      },
    },
  });

  if (!group) {
    return { success: false };
  }

  if (group._count.userOnGroup > 0) {
    return { success: false, hasMembers: true };
  }

  await db.group.delete({
    where: {
      id,
      workspace: {
        slug: team,
      },
    },
  });

  return { success: true };
}
