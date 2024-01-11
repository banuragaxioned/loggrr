"use server";

import { checkRole } from "@/lib/access";
import { db } from "@/db";

export async function createGroup(team: string, groupName: string) {
  try {
    await db.userGroup.create({
      data: {
        name: groupName,
        Workspace: {
          connect: {
            slug: team,
          },
        },
      },
    });
  } catch (e) {
    throw new Error("Failed to create group");
  }

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
      Workspace: {
        slug: team,
      },
    },
  });

  return { success: true };
}
