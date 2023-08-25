import { db } from "@/lib/db";
import { Role } from "@prisma/client";

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
      role: member.Roles[0]?.role as Role,
    };
  });

  return members;
};