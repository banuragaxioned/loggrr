import { getServerSession } from "next-auth/next";
import * as z from "zod";
import { parse, formatISO } from "date-fns";

import { authOptions } from "@/server/auth";
import { db } from "@/server/db";

const commonValidationObj = {
  team: z.string().min(1),
  project: z.number(),
  milestone: z.number(),
  time: z.number(),
  comments: z.string().min(1),
  billable: z.boolean(),
  date: z.string(),
  task: z.number().min(1).optional(),
};

const TimeEntrySchema = z.object(commonValidationObj);
const TimeEntryUpdateSchema = z.object({ ...commonValidationObj, id: z.number().min(1) });

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    const json = await req.json();
    const body = TimeEntrySchema.parse(json);

    // check if the user has permission to the current team/workspace id if not return 403
    // user session has an object (name, id, slug, etc) of all workspaces the user has access to. i want to match slug.
    if (user.workspaces.filter((workspace) => workspace.slug === body.team).length === 0) {
      return new Response("Unauthorized", { status: 403 });
    }
    //schema goes here
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
    return new Response(JSON.stringify(timeEntry));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}

export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams;
  const team = searchParams.get("team");
  const date = searchParams.get("date");

  if (!date) return new Response("No date provided", { status: 403 });

  const parsedDate = parse(date, "EEE, MMM dd, yyyy", new Date());
  const isoDateString = `${formatISO(parsedDate, { representation: "date" })}T00:00:00.000Z`;

  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    // check if the user has permission to the current team/workspace id if not return 403
    // user session has an object (name, id, slug, etc) of all workspaces the user has access to. i want to match slug.
    if (user.workspaces.filter((workspace) => workspace.slug === team).length === 0) {
      return new Response("Unauthorized", { status: 403 });
    }
    //schema goes here
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
        project: {
          select: {
            id: true,
            name: true,
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
        time: true,
        date: true,
      },
      orderBy: {
        projectId: "asc",
      },
    });

    const dayTotal = +(response.reduce((sum, item) => (sum += item.time), 0) / 60).toFixed(2);
    const transformedData: any = [];
    const projectsMap: any = {};

    response.forEach((log) => {
      if (!projectsMap[log.project.id]) {
        projectsMap[log.project.id] = {
          project: log.project,
          data: [],
          total: 0,
        };
        transformedData.push(projectsMap[log.project.id]);
      }
      projectsMap[log.project.id].data.push({
        id: log.id,
        billable: log.billable,
        time: log.time / 60,
        milestone: log.milestone,
        task: log.task,
        comments: log.comments,
      });
      projectsMap[log.project.id].total += log.time / 60;
    });

    const updatedResponse = {
      dayTotal,
      projectsLog: transformedData,
    };

    if (updatedResponse.projectsLog.length < 1 || dayTotal === 0) {
      return new Response(JSON.stringify({}));
    }

    return new Response(JSON.stringify(updatedResponse));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const searchParams = new URL(req.url).searchParams;
  const team = searchParams.get("team");
  const id = searchParams.get("id") as string;

  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;
    // check if the user has permission to the current team/workspace id if not return 403
    // user session has an object (name, id, slug, etc) of all workspaces the user has access to. i want to match slug.
    if (user.workspaces.filter((workspace) => workspace.slug === team).length === 0) {
      return new Response("Unauthorized", { status: 403 });
    }
    //schema goes here
    const query = await db.timeEntry.delete({
      where: {
        id: +id,
      },
    });

    return new Response(JSON.stringify(query));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;
    const json = await req.json();
    const body = TimeEntryUpdateSchema.parse(json);

    // check if the user has permission to the current team/workspace id if not return 403
    // user session has an object (name, id, slug, etc) of all workspaces the user has access to. i want to match slug.
    if (user.workspaces.filter((workspace) => workspace.slug === body.team).length === 0) {
      return new Response("Unauthorized", { status: 403 });
    }

    //schema goes here
    const query = await db.timeEntry.update({
      where: {
        id: body.id,
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

    return new Response(JSON.stringify(query));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
