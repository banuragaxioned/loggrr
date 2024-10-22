import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { endOfDay, format, startOfDay } from "date-fns";

import { authOptions } from "@/server/auth";
import { db } from "@/server/db";
import { getTimeInHours, stringToBoolean } from "@/lib/helper";
import { getStartandEndDates } from "@/lib/months";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) return NextResponse.json({ error: "Unauthorized! You are not logged in." }, { status: 403 });

    const { user } = session;

    const { slug, selectedRange, selectedBilling, selectedClients, selectedMembers, selectedProject } = data;
    const { startDate, endDate } = selectedRange ? getStartandEndDates(selectedRange) : getStartandEndDates("", 30);
    const isBillable = stringToBoolean(selectedBilling);
    const start = startOfDay(startDate);
    const end = endOfDay(endDate);

    const userWorkspace = user.workspaces.find((workspace) => workspace.slug === slug);

    if (!userWorkspace) {
      return new Response("Unauthorized!", { status: 403 });
    }

    const workspaceRole = userWorkspace.role;
    const hasFullAccess = !["GUEST"].includes(workspaceRole);

    const response = await db.timeEntry.findMany({
      where: {
        workspace: {
          slug,
        },
        date: {
          gte: start,
          lte: end,
        },
        billable: {
          ...(isBillable !== null && { equals: isBillable }),
        },
        time: {
          gt: 0, // Include only entries where time is greater than 0
        },
        project: {
          ...(selectedClients && {
            clientId: {
              in: selectedClients.split(",").map((id: number) => +id),
            },
          }),
          ...(selectedProject && {
            id: {
              equals: +selectedProject,
            },
          }),
        },
        ...(selectedMembers && {
          userId: {
            in: selectedMembers.split(",").map((id: number) => +id),
          },
        }),
        ...(!hasFullAccess &&
          user.id && {
            userId: {
              equals: user.id,
            },
          }),
      },
      select: {
        project: {
          select: {
            name: true,
            client: {
              select: {
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
          },
        },
        milestone: {
          select: {
            name: true,
          },
        },
        task: {
          select: {
            name: true,
          },
        },
        date: true,
        comments: true,
        time: true,
        billable: true,
      },
      orderBy: {
        user: {
          name: "asc",
        },
      },
    });

    // sanitizing comma so as to concat the
    const sanitize = (str: string) => {
      return str.replaceAll(",", "‚");
    };

    const updatedResponse = response
      // Sort by project name
      .sort((a, b) => a.project.name.localeCompare(b.project.name))
      // Sort by client name
      .sort((a, b) => a.project.client.name.localeCompare(b.project.client.name))
      .map((entry) => ({
        client: sanitize(entry.project.client.name),
        project: sanitize(entry.project.name),
        user: sanitize(entry.user.name ?? " "),
        milestone: sanitize(entry.milestone?.name ?? " "),
        task: sanitize(entry.task?.name ?? " "),
        date: format(new Date(entry.date), "dd/MM/yyyy"),
        comments: sanitize(entry.comments ?? " "),
        timeLogged: getTimeInHours(entry.time),
        billingType: entry.billable ? "Billable" : "Non billable",
      }));

    return NextResponse.json(updatedResponse);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
