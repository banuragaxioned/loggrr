import { db } from "@/server/db";

export const getMembers = async (team: string) => {
  const membersList = await db.workspaceMembership.findMany({
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
          UserGroup: {
            select: {
              id: true,
              name: true,
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
      UserGroup: list.user.UserGroup,
    };
  });
  console.log(flatMemberList);

  return flatMemberList;
};

export const getUserGroup = async (team: string) => {
  const data = await db.userGroup.findMany({
    where: { Workspace: { slug: team } },
    select: {
      id: true,
      name: true,
    },
  });

  return data;
};
