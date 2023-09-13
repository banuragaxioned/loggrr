import { db } from "@/lib/db";

export const getMembers = async (team: string) => {
  const data = await db.tenant.findUnique({
    where: { slug: team },
    select: {
      Users: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          status: true,
          Roles: {
            select: {
              role: true,
            },
          },
          UserGroup: {
            select: {
              id: true,
              name: true,
            }
          }
        },
      },
    },
  });

  const members = data?.Users.map((member) => {
    return {
      id: member.id,
      name: member.name,
      email: member.email,
      image: member.image,
      status: member.status,
      role: member.Roles[0]?.role,
      userGroup: member.UserGroup
    };
  });

  return members;
};

export const getUserGroup = async(team: string) => {
  const data = await db.userGroup.findMany({
    where: { Tenant: { slug: team } },
    select: {
      id: true,
      name: true,
    }
  })

  return data
} 