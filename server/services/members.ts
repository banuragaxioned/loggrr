import { db } from "@/server/db";

export const getMembers = async (team: string) => {
  const membersList = await db.workspaceMembership.findMany({
    where: { workspace: { slug: team } },
    select: {
      role: true,
      member: {
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
      id: list.member.id,
      name: list.member.name,
      email: list.member.email,
      image: list.member.image,
      status: list.member.status,
      role: list.role,
      UserGroup: list.member.UserGroup,
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
