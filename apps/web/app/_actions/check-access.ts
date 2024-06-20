"use server";

import { Role } from "@prisma/client";
import { db } from "@/server/db";
import { getCurrentUser } from "@/server/session";

export async function checkRole(team: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false };
  }

  try {
    const response = await db.userWorkspace.findUniqueOrThrow({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId: 1, // FIX: this is hardcoded
        },
        NOT: {
          role: Role.INACTIVE,
        },
      },
    });
  } catch (e) {
    return { success: false, message: "You dont have sufficient access" };
  }

  return { success: true };
}
