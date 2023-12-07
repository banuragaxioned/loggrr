"use server";

import { checkRole } from "@/lib/access";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";

export async function createGroup(team: string, groupName: string) {
  const isOwner = await checkRole(team, Role.OWNER);
  if (!isOwner) {
    return { success: false };
  }

  await db.userGroup.create({
    data: {
      name: groupName,
      Tenant: {
        connect: {
          slug: team,
        },
      },
    },
  });

  return { success: true };
}

export async function deletePost(team: string, id: number) {
  const isOwner = await checkRole(team, Role.OWNER);

  if (!isOwner) {
    return { success: false };
  }

  await db.userGroup.delete({
    where: {
      id: id,
      Tenant: {
        slug: team,
      },
    },
  });

  return { success: true };
}
