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
          userOnGroup: {
            where: {
              user: {
                workspaces: {
                  some: {
                    workspace: { slug: team },
                    role: { not: "INACTIVE" },
                  },
                },
              },
            },
          },
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
