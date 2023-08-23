import { db } from "@/lib/db";
import { Role, UserStatus, UsersStatus } from "@prisma/client";

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
          Roles: {
            select: {
              role: true,
            },
          },
          UsersStatus: {
            where: {Tenant : { slug: team }},
            select: {
              status: true
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
      status: member.UsersStatus[0]?.status as UserStatus,
      role: member.Roles.map((userRole) => userRole.role)[0] as Role,
      tenant: team
    };
  });

  return members;
};
