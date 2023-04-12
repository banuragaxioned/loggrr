import { prisma } from "../db";

export const getMembers = (slug: string, projectId: number) => {
  const members = prisma.project.findMany({
    where: { Tenant: { slug }, id: +projectId },
    select: {
      Members: { select: { id: true, name: true, image: true } },
      Owner: { select: { id: true, name: true, image: true } },
    },
  });

  return members;
};
