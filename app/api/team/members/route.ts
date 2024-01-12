import { db } from "@/server/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const users = await db.workspaceMembership.findMany({
      where: {
        workspace: {
          slug: "axioned",
        },
      },
      select: {
        role: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            status: true,
          },
        },
      },
    });

    const flatMemberList = users.map((list) => {
      return {
        id: list.user.id,
        name: list.user.name,
        email: list.user.email,
        image: list.user.image,
        status: list.user.status,
        role: list.role,
      };
    });

    return new Response(JSON.stringify(flatMemberList));
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
