import { db } from "@/lib/db";
import { Role, Status } from "@prisma/client";

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
      status: member.status as Status,
      role: member.Roles.map((userRole) => userRole.role)[0] as Role,
      tenant: team
    };
  });

  return members;
};
