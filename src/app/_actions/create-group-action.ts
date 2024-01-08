"use server";

import { checkRole } from "@/lib/access";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";

export async function createGroup(team: string, groupName: string) {
  const hasAccess = await checkRole(team);
  if (!hasAccess) {
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

export async function deleteGroup(team: string, id: number) {
  const hasAccess = await checkRole(team);

  if (!hasAccess) {
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
