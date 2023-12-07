"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { Role } from "@prisma/client";

export async function checkRole(team: string, role: Role) {
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
      role: role,
      Tenant: {
        slug: team,
      },
    },
  });

  if (response.role !== role) {
    return { success: false };
  }

  return { success: true };
}
