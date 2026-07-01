import { db } from "@/server/db";

export async function getGroups(team: string) {
  const data = await db.group.findMany({
    where: { workspace: { slug: team } },
    select: {
      id: true,
      name: true,
      createdAt: true,
      _count: {
        select: {
          userOnGroup: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return data.map((group) => ({
    id: group.id,
    name: group.name,
    createdAt: group.createdAt,
    memberCount: group._count.userOnGroup,
  }));
}
