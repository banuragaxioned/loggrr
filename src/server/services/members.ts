import { db } from "@/lib/db";

export const getMembers = async (team: string) => {
  const roles = await db.tenant.findUnique({
    where: { slug: team },
    select: {
      UserRole: {
        select: {
          id: true,
          userId: true,
          role: true,
          User: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            },
          },
        },
      },
    },
  });

  const members = await roles?.UserRole.map((obj) => {
    const id = obj.id;
    const role = obj.role;
    const user = obj.User;
    return { id, userId: user?.id, name: user?.name, avatar: user?.image, mail: user?.email, role };
  });
  return members;
};

export const getAllMembers = async () => {
  const allMembers = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      allocationId: true,
      Roles: {
        select: {
          id: true,
          role: true,
          tenantId: true,
          Tenant: {
            select: {
              slug: true,
            }
          }
        }
      }
    }
  })
  return allMembers
}
