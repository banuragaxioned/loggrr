"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function createGroup(team: string, groupName: string) {
  const user = await getCurrentUser();

  if (!user) {
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

export async function deletePost(id: number) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false };
  }

  await db.userGroup.delete({
    where: {
      id: id,
    },
  });

  return { success: true };
}
