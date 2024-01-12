"use server";

import { db } from "@/server/db";
import { getCurrentUser } from "@/server/session";
import { Role } from "@prisma/client";

export async function checkRole(team: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false };
  }

  try {
    const response = await db.workspaceMembership.findUniqueOrThrow({
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
