import { db } from "@/server/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const members = await db.workspaceMembership.findMany({
      where: {
        workspace: {
          slug: "axioned",
        },
      },
      select: {
        role: true,
        member: {
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

    const flatMemberList = members.map((list) => {
      return {
        id: list.member.id,
        name: list.member.name,
        email: list.member.email,
        image: list.member.image,
        status: list.member.status,
        role: list.role,
      };
    });

    return new Response(JSON.stringify(flatMemberList));
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
