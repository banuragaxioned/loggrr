import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/session";
import { db } from "@/server/db";
import { checkAccess, getUserRole } from "@/lib/helper";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { team, userId, leaves } = body;

    // Convert empty strings to 0
    const processedLeaves = {
      planned: {
        eligible: leaves.planned.eligible === "" ? 0 : Number(leaves.planned.eligible),
        taken: leaves.planned.taken === "" ? 0 : Number(leaves.planned.taken),
      },
      unplanned: {
        eligible: leaves.unplanned.eligible === "" ? 0 : Number(leaves.unplanned.eligible),
        taken: leaves.unplanned.taken === "" ? 0 : Number(leaves.unplanned.taken),
      },
      compoff: {
        eligible: leaves.compoff.eligible === "" ? 0 : Number(leaves.compoff.eligible),
        taken: leaves.compoff.taken === "" ? 0 : Number(leaves.compoff.taken),
      },
    };

    const workspaceRole = getUserRole(user.workspaces, team);
    const grantAccess = ["HR", "OWNER"];
    const hasAccess = checkAccess(workspaceRole, grantAccess, "allow");

    if (!hasAccess) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get workspace ID from slug
    const workspace = await db.workspace.findFirst({
      where: {
        slug: team,
      },
    });

    if (!workspace) {
      return new NextResponse("Workspace not found", { status: 404 });
    }

    // Check if user already has leave record
    const existingLeave = await db.userLeaves.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId: workspace.id,
        },
      },
    });

    if (existingLeave) {
      return new NextResponse(
        JSON.stringify({
          error: "Leave record already exists for this user",
        }),
        { status: 409 },
      );
    }

    // Create new leave record
    const userLeaves = await db.userLeaves.create({
      data: {
        userId,
        workspaceId: workspace.id,
        leaves: processedLeaves,
        lastUpdatedBy: user.email ?? "",
      },
    });

    return NextResponse.json(userLeaves);
  } catch (error) {
    console.error("[LEAVES_CREATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

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

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { team, id, userId } = body;

    const workspaceRole = getUserRole(user.workspaces, team);
    const grantAccess = ["HR", "OWNER"];
    const hasAccess = checkAccess(workspaceRole, grantAccess, "allow");

    if (!hasAccess) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const leaveRecord = await db.userLeaves.delete({
      where: { id, workspace: { slug: team } },
      include: {
        user: true,
      },
    });

    if (leaveRecord.user.id !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    return NextResponse.json(leaveRecord);
  } catch (error) {
    console.error("[LEAVES_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
