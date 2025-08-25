import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/server/auth";
import { sendEmail } from "@/lib/email";
import LeavesEmail from "@/emails/leaves-email";

export interface LeavesData {
  name: string;
  email: string;
  leaves: {
    unplanned: { eligible: string; taken: string; remaining: string };
    planned: { eligible: string; taken: string; remaining: string };
    compoff: { eligible: string; taken: string; remaining: string };
  };
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) return NextResponse.json({ error: "Unauthorized! You are not logged in." }, { status: 403 });

    const { user } = session;
    const { slug, users, subject } = data;

    const userWorkspace = user.workspaces.find((workspace) => workspace.slug === slug);

    // Only allow Axioned employees to send leaves
    if (!userWorkspace || !user.email?.includes("@axioned.com")) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 403 });
    }

    const workspaceRole = userWorkspace.role;
    const denyAccess = ["GUEST", "USER", "INACTIVE"];

    if (denyAccess.includes(workspaceRole)) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 403 });
    }

    const transformedData: {
      name: string;
      email: string;
      leaves: {
        unplanned: { eligible: string; taken: string; remaining: string };
        planned: { eligible: string; taken: string; remaining: string };
        compoff: { eligible: string; taken: string; remaining: string };
      };
    }[] = users.map((user: any): LeavesData => {
      return {
        name: user[0],
        email: user[1],
        leaves: {
          unplanned: {
            eligible: user[2],
            taken: user[4],
            remaining: user[6],
          },
          planned: {
            eligible: user[3],
            taken: user[5],
            remaining: user[7],
          },
          compoff: {
            eligible: user[8],
            taken: user[9],
            remaining: user[10],
          },
        },
      };
    });

    transformedData.forEach(async (user: LeavesData) => {
      const leavesEmailHtml = LeavesEmail({ subject, data: user });

      const workspaceEmailOptions = {
        to: user.email,
        subject,
        html: leavesEmailHtml,
      };

      await sendEmail(workspaceEmailOptions);
    });

    console.log(subject, JSON.stringify(transformedData, null, 2));

    return NextResponse.json({ message: "Leaves sent successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
