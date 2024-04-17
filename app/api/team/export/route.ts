import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) return NextResponse.json({ error: "Unauthorized! You are not logged in." }, { status: 403 });

    const { user } = session;

    const { slug } = data;
    console.log(slug, "slug");

    if (!user.workspaces.find((workspace) => workspace.slug === slug)) {
      return new Response("Unauthorized!", { status: 403 });
    }

    const response = await db.timeEntry.findMany({
      where: {
        workspace: {
          slug,
        },
      },
      select: {
        project: true,
      },
    });

    return NextResponse.json({ data: response });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
