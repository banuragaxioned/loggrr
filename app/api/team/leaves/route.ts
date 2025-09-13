import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/session";
import { db } from "@/server/db";
import { checkAccess, getUserRole } from "@/lib/helper";

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { team, id, leaves } = body;

    const workspaceRole = getUserRole(user.workspaces, team);
    const grantAccess = ["HR", "OWNER"];
    const hasAccess = checkAccess(workspaceRole, grantAccess, "allow");

    if (!hasAccess) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const workspace = await db.workspace.findFirst({
      where: { slug: team },
    });

    if (!workspace) {
      return new NextResponse("Workspace not found", { status: 404 });
    }

    const leaveRecord = await db.userLeaves.update({
      where: {
        id,
      },
      data: {
        leaves,
        lastUpdatedBy: user.email ?? "",
      },
    });

    return NextResponse.json(leaveRecord);
  } catch (error) {
    console.error("[LEAVES_UPDATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
