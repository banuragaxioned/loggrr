import { db } from "@/server/db";

export const getMembers = async (team: string) => {
  const membersList = await db.userWorkspace.findMany({
    where: { workspace: { slug: team } },
    select: {
      role: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          status: true,
          userOnGroup: {
            select: {
              group: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            where: {
              workspace: {
                slug: team,
              },
            },
          },
        },
      },
    },
    orderBy: {
      user: {
        name: "asc",
      },
    },
  });

  const flatMemberList = membersList.map((list) => {
    return {
      id: list.user.id,
      name: list.user.name,
      email: list.user.email,
      image: list.user.image,
      status: list.user.status,
      role: list.role,
      userGroup: list.user.userOnGroup.map((group) => group.group),
    };
  });

  return flatMemberList;
};

export const getProjectMembers = async ({ projectId, team }: { team: string; projectId: number }) => {
  const membersList = await db.usersOnProject.findMany({
    where: { projectId: Number(projectId), workspace: { slug: team } },
    select: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          usersOnProject: {
            where: {
              projectId: Number(projectId),
            },
            select: {
              id: true,
              projectId: true,
              createdAt: true,
            },
          },
        },
      },
    },
    orderBy: {
      user: {
        name: "asc",
      },
    },
  });

  return membersList?.map((list) => list.user) || [];
};

export const isMember = async (slug: string, userId: number) => {
  try {
    const response = await db.userWorkspace.findFirstOrThrow({
      where: {
        workspace: {
          slug,
        },
        user: {
          id: userId,
        },
      },
    });

    return response;
  } catch (err) {
    throw new Error("You are not a member of this workspace");
  }
};
