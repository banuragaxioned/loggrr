import { prisma } from "../db";
import { db } from "@/lib/db";

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
  const users = await prisma.user.findMany({
    where: { Workspace: { some: { slug } } },
    select: {
      id: true,
      name: true,
      Allocation: { select: { id: true, projectId: true } },
    },
  });
  return users;
};
