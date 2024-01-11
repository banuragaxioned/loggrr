"use server";

import { db } from "@/server/db";
import { getCurrentUser } from "lib/session";
import { Role } from "@prisma/client";

export async function checkRole(team: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false };
  }

  try {
    const response = await db.userRole.findUniqueOrThrow({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId: 1, // FIXME: this is hardcoded
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
