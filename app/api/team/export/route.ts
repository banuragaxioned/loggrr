import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/server/auth";
import { db } from "@/server/db";
import { stringToBoolean } from "@/lib/helper";
import { getMonthStartAndEndDates } from "@/lib/months";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) return NextResponse.json({ error: "Unauthorized! You are not logged in." }, { status: 403 });

    const { user } = session;

    const { slug, selectedMonth, selectedBilling, selectedClients, selectedMembers } = data;
    const { startDate, endDate } = getMonthStartAndEndDates(selectedMonth) ?? {};
    const isBillable = stringToBoolean(selectedBilling);

    if (!user.workspaces.find((workspace) => workspace.slug === slug)) {
      return new Response("Unauthorized!", { status: 403 });
    }

    const response = await db.timeEntry.findMany({
      where: {
        workspace: {
          slug,
        },
        date: {
          gte: startDate ? startDate : new Date(0),
          lte: endDate ? endDate : new Date(),
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
        },
        ...(selectedMembers && {
          userId: {
            in: selectedMembers.split(",").map((id: number) => +id),
          },
        }),
      },
      select: {
        // project: true,
        // date: true,
        time: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ data: response });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
