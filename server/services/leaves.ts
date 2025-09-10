import { db } from "@/server/db";

export const getLeaves = async (team: string) => {
  const data = await db.userLeaves.findMany({
    where: { workspace: { slug: team } },
    select: {
      id: true,
      leaves: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return data;
};
