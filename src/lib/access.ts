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
    select: {
      role: true,
    },
    where: {
      id: user.id,
      Tenant: {
        slug: team,
      },
    },
  });

  if (response.role === Role.INACTIVE) {
    return { success: false };
  }

  return { success: true };
}
