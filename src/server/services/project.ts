import { prisma } from "../db";
import { db } from "@/lib/db";

export const getMembers = async (slug: string, projectId: number) => {
  const members = await prisma.project.findMany({
    where: { Tenant: { slug }, id: +projectId },
    select: {
      Members: { select: { id: true, name: true, image: true } },
      Owner: { select: { id: true, name: true, image: true } },
    },
  });

  return members;
};

export const getProjects = async (slug: string) => {
  const projects = await db.project.findMany({
    where: { Tenant: { slug } },
    select: {
      id: true,
      name: true,
      billable: true,
      interval: true,
      Client: { select: { id: true, name: true } },
      Owner: { select: { id: true, name: true, image: true } },
      status: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return projects;
};

export const getClients = async (slug: string) => {
  const projects = await db.project.findMany({
    where: { Tenant: { slug } },
    select: {
      id: true,
      name: true,
      status: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return projects;
};
