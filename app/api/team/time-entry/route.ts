import { getServerSession } from "next-auth/next";
import * as z from "zod";
import { parse, formatISO } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/server/auth";
import { db } from "@/server/db";
import { TimeEntryData } from "@/types";

const commonValidationObj = {
  team: z.string().min(1),
  project: z.number(),
  milestone: z.number().optional(),
  time: z.number(),
  comments: z.string().min(1),
  billable: z.boolean(),
  date: z.string(),
  task: z.number().optional(),
};

const TimeEntrySchema = z.object(commonValidationObj);
const TimeEntryUpdateSchema = z.object({ ...commonValidationObj, id: z.number().min(1) });

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const team = searchParams.get("team");
  const date = searchParams.get("date");

  if (!date) return NextResponse.json({ error: "No date provided" }, { status: 403 });

  // Searching for time entries based on particular day
  const parsedDate = parse(date, "EEE, MMM dd, yyyy", new Date());
  const isoDateString = `${formatISO(parsedDate, { representation: "date" })}T00:00:00.000Z`;

  try {
    const session = await getServerSession(authOptions);

    if (!session) return NextResponse.json({ error: "Unauthorized! You are not logged in." }, { status: 403 });

    const { user } = session;

    const foundWorkspace = user.workspaces.find((workspace) => workspace.slug === team);

    // check if the user has permission to the current team/workspace id if not return 403
    if (!foundWorkspace) {
      return NextResponse.json({ error: "Unauthorized! Workspace not found." }, { status: 403 });
    }

    const response = await db.timeEntry.findMany({
      where: {
        userId: user.id,
        workspace: {
          slug: team ? team : "",
        },
        date: {
          equals: isoDateString,
        },
      },
      select: {
        id: true,
        billable: true,
        comments: true,
        time: true,
        date: true,
        project: {
          select: {
            id: true,
            name: true,
            billable: true,
            client: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        milestone: {
          select: {
            id: true,
            name: true,
          },
        },
        task: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        project: {
          name: "asc", // Shows projects by name in ascending order
        },
      },
    });

    const updatedResponse = response.reduce(
      (acc: TimeEntryData, current) => {
        // Accumulate day total here
        const dayTotal = +(acc.dayTotal + current.time / 60).toFixed(2);

        const data = {
          id: current.id,
          billable: current.billable,
          time: current.time / 60,
          milestone: current.milestone,
          task: current.task,
          comments: current.comments,
        };

        // Accumulate projects here
        const projectsLog = [...acc.projectsLog];
        const projectObj = {
          id: current.project.id,
          name: current.project.name,
          billable: current.project.billable,
          client: current.project.client,
        };
        const index = projectsLog.findIndex((obj) => obj?.project?.id === current.project.id); // Check if project exists
        if (index > -1) {
          projectsLog[index]?.data.push(data);
          projectsLog[index].total += +(current?.time / 60).toFixed(2);
        } else {
          projectsLog.push({ project: projectObj, data: [data], total: current?.time / 60 });
        }

        return {
          dayTotal,
          projectsLog,
        };
      },
      {
        dayTotal: 0,
        projectsLog: [],
      },
    );

    if (updatedResponse.projectsLog.length < 1 || updatedResponse.dayTotal === 0) return NextResponse.json({});

    return NextResponse.json(updatedResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 });
    }

    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) return NextResponse.json({ error: "Unauthorized! You are not logged in." }, { status: 403 });

    const { user } = session;

    const json = await req.json();
    const body = TimeEntrySchema.parse(json);

    const foundWorkspace = user.workspaces.find((workspace) => workspace.slug === body.team);

    // check if the user has permission to the current team/workspace id if not return 403
    if (!foundWorkspace) {
      return NextResponse.json({ error: "Unauthorized! Workspace not found." }, { status: 403 });
    }

    const timeEntry = await db.timeEntry.create({
      data: {
        time: body.time,
        comments: body.comments,
        milestoneId: body.milestone,
        billable: body.billable,
        userId: user.id,
        projectId: body.project,
        date: new Date(body.date),
        taskId: body.task,
        workspaceId: user.workspaces.filter((workspace) => workspace.slug === body.team)[0].id,
      },
    });
    return NextResponse.json(timeEntry);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 });
    }

    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) return NextResponse.json({ error: "Unauthorized! You are not logged in." }, { status: 403 });

    const { user } = session;
    const json = await req.json();
    const body = TimeEntryUpdateSchema.parse(json);

    const foundWorkspace = user.workspaces.find((workspace) => workspace.slug === body.team);

    // check if the user has permission to the current team/workspace id if not return 403
    if (!foundWorkspace) {
      return NextResponse.json({ error: "Unauthorized! Workspace not found." }, { status: 403 });
    }

    const query = await db.timeEntry.update({
      where: {
        id: body.id,
        workspace: {
          slug: body.team,
        },
      },
      data: {
        time: body.time,
        comments: body.comments,
        milestoneId: body.milestone,
        billable: body.billable,
        projectId: body.project,
        taskId: body.task,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(query);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 });
    }

    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const team = searchParams.get("team");
  const id = searchParams.get("id") as string;

  try {
    const session = await getServerSession(authOptions);

    if (!session) return NextResponse.json({ error: "Unauthorized! You are not logged in." }, { status: 403 });

    const { user } = session;

    const foundWorkspace = user.workspaces.find((workspace) => workspace.slug === team);

    // check if the user has permission to the current team/workspace id if not return 403
    if (!foundWorkspace) {
      return NextResponse.json({ error: "Unauthorized! Workspace not found." }, { status: 403 });
    }

    const query = await db.timeEntry.delete({
      where: {
        id: +id,
      },
    });

    return NextResponse.json(query);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 });
    }

    return NextResponse.json({ error }, { status: 500 });
  }
}
