"use server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { Role } from "@prisma/client";

export async function checkRole(team: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false };
  }
  const response = await db.userRole.findUniqueOrThrow({
    where: {
      id: user.id,
      userId: user.id,
      Workspace: {
        slug: team,
      },
    },
  });

  if (response.role === Role.INACTIVE) {
    return { success: false };
  }

  return { success: true };
}
