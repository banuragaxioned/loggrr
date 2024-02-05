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
          },
        },
      },
    },
  });

  const flatMemberList = membersList?.map((list) => {
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

export const isMember = async (slug: string, userId: number) => {
  try {
    const response = await db.userWorkspace.findFirstOrThrow({
      where: {
        workspace: {
          slug: slug,
        },
        user: {
          id: userId,
        },
      },
    });

    if (!response) {
      throw new Error("You are not a member of this workspace");
    }

    return response;
  } catch (err) {
    // TODO
  }
};
