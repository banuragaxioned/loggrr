"use server";

import { type User, type Workspace } from "@prisma/client";
import { db } from "@/server/db";

export async function addToWorkspace(slug: Workspace["slug"], user: User) {
  try {
    await db.workspace.update({
      where: { slug },
      data: {
        users: {
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
      where: { slug },
      data: {
        users: {
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
