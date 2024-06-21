import { db } from "@/server/db";

export const getGroups = async (team: string) => {
  const data = await db.group.findMany({
    where: { workspace: { slug: team } },
    select: {
      id: true,
      name: true,
    },
  });

  return data;
};
