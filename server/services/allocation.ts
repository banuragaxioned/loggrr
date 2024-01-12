import { Workspace } from "@prisma/client";
import { db } from "@/server/db";

export async function getProjectsId(slug: string) {
  const projects = await db.project.findMany({
    where: { Workspace: { slug } },
    select: {
      id: true,
      name: true,
      Members: { select: { id: true, name: true } },
    },
  });

  return projects;
}

export const getAllUsers = async (slug: string) => {
  const users = await db.user.findMany({
    where: { workspaces: { some: { workspace: { slug: slug } } } },
    select: {
      id: true,
      name: true,
      Allocation: { select: { id: true, projectId: true } },
    },
  });
  return users;
};
