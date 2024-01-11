"use server";

import { db } from "@/server/db";
import { User, Workspace } from "@prisma/client";

export async function addToWorkspace(slug: Workspace["slug"], user: User) {
  try {
    await db.workspace.update({
      where: { slug: slug },
      data: {
        Users: {
          connect: {
            id: Number(user.id),
          },
        },
      },
    });
  } catch (e) {
    throw new Error("Failed to add user");
  }
  return { success: true };
}

export async function removeFromWorkspace(slug: Workspace["slug"], user: User) {
  try {
    await db.workspace.update({
      where: { slug: slug },
      data: {
        Users: {
          disconnect: {
            id: Number(user.id),
          },
        },
      },
    });
  } catch (e) {
    throw new Error("Failed to create the workspace");
  }
  return { success: true };
}
