import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/server/auth";
import { sendEmail } from "@/lib/email";
import LeavesEmail from "@/emails/leaves-email";
import { Leaves } from "@/components/forms/leaveForm";
import { format } from "date-fns";

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
    const { slug, leaves } = data;

    const userWorkspace = user.workspaces.find((workspace) => workspace.slug === slug);

    // Check if the user has access to the workspace
    if (!userWorkspace) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 403 });
    }

    const workspaceRole = userWorkspace.role;
    const grantAccess = ["HR", "OWNER"];

    if (!grantAccess.includes(workspaceRole)) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 403 });
    }

    const transformedData = leaves.map((leave: Leaves): LeavesData => {
      return {
        name: leave.user.name ?? `${slug} Member`,
        email: leave.user.email,
        leaves: {
          unplanned: {
            eligible: leave.leaves.unplanned.eligible,
            taken: leave.leaves.unplanned.taken,
            remaining: String(leave.leaves.unplanned.eligible - leave.leaves.unplanned.taken),
          },
          planned: {
            eligible: leave.leaves.planned.eligible,
            taken: leave.leaves.planned.taken,
            remaining: String(leave.leaves.planned.eligible - leave.leaves.planned.taken),
          },
          compoff: {
            eligible: leave.leaves.compoff.eligible,
            taken: leave.leaves.compoff.taken,
            remaining: String(leave.leaves.compoff.eligible - leave.leaves.compoff.taken),
          },
        },
      };
    });

    const unsentEmails: {
      email: string;
      name: string;
    }[] = [];

    const sentEmails: {
      email: string;
      name: string;
    }[] = [];

    const today = new Date();
    const day = format(today, "dd MMMM yyyy");
    const subject = `Your Leaves Status till ${day}`;

    // Use Promise.allSettled to handle async operations properly
    const emailPromises = transformedData.map(async (user: LeavesData) => {
      const leavesEmailHtml = LeavesEmail({ subject, data: user });

      const leavesEmailOptions = {
        to: user.email,
        subject,
        html: leavesEmailHtml,
      };

      try {
        // Send actual email for other indices
        const response = await sendEmail(leavesEmailOptions);

        if (response.success) {
          return { success: true, email: user.email, name: user.name };
        } else {
          return { success: false, email: user.email, name: user.name };
        }
      } catch (error) {
        return { success: false, email: user.email, name: user.name };
      }
    });

    // Wait for all emails to be processed
    const results = await Promise.allSettled(emailPromises);

    // Process results and populate arrays
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        const { success, email, name } = result.value;
        if (success) {
          sentEmails.push({ email, name });
        } else {
          unsentEmails.push({ email, name });
        }
      }
    });

    let message = "Leaves sent successfully";

    if (unsentEmails.length > 0) {
      message = "Unsent emails. Please check the unsent emails.";
    }

    if (unsentEmails.length > 0 && sentEmails.length > 0) {
      message = "Partially sent. Please check the unsent emails.";
    }

    return NextResponse.json({ message, unsentEmails, sentEmails }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
