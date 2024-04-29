import { db } from "@/server/db";

export async function getProjectsId(slug: string) {
  const projectTeam = await db.project.findMany({
    where: { workspace: { slug } },
    select: {
      id: true,
      name: true,
      usersOnProject: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  // flatten the response
  const response = projectTeam.map((project) => {
    return {
      id: project.id,
      name: project.name,
      users: project.usersOnProject.map((user) => {
        return {
          id: user.user.id,
          name: user.user.name,
        };
      }),
    };
  });

  return response;
}

export const getAllUsers = async (slug: string) => {
  const users = await db.user.findMany({
    where: { workspaces: { some: { workspace: { slug: slug } } } },
    select: {
      id: true,
      name: true,
    },
  });
  return users;
};
