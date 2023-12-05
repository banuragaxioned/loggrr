"use server";

import { db } from "@/lib/db";

export async function createGroup(team: string, groupName: string) {
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
  await db.userGroup.delete({
    where: {
      id: id,
    },
  });

  return { success: true };
}
