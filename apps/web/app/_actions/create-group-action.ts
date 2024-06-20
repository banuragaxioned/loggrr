"use server";

import { checkRole } from "@/app/_actions/check-access";
import { db } from "@/server/db";

export async function createGroup(team: string, groupName: string) {
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
