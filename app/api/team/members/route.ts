import { db } from "@/server/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    const data = await db.workspace.findUnique({
      where: { slug: "axioned" },
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
              where: {
                role: {
                  not: undefined,
                },
              },
            },
          },
        },
      },
    });

    const memberList = data?.Users.map((member) => {
      return {
        id: member.id,
        name: member.name,
        email: member.email,
        image: member.image,
        status: member.status,
        role: member.Roles.map((userRole) => userRole.role)[0],
      };
    });

    return new Response(JSON.stringify(memberList));
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
