import { getServerSession } from "next-auth/next";
import * as z from "zod";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";
import { TimeEntryDataObj } from "types";

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
  const dates = searchParams.get("dates");
  const dateStrs: string[] =
    dates &&
    JSON.parse(dates)?.map((date: Date) =>
      new Date(date).toLocaleDateString("en-us", {
        day: "2-digit",
        month: "short",
        weekday: "short",
      }),
    );

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
        Workspace: {
          slug: team ? team : "",
        },
      },
      select: {
        id: true,
        billable: true,
        comments: true,
        Project: {
          select: {
            id: true,
            name: true,
            Client: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        Milestone: {
          select: {
            id: true,
            name: true,
          },
        },
        Task: {
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

    const restructuredData = response.reduce((prev: TimeEntryDataObj, current) => {
      const currentDateStr = current.date.toLocaleDateString("en-us", {
        day: "2-digit",
        month: "short",
        weekday: "short",
      });
      const check = dateStrs.includes(currentDateStr);
      const project = { ...current?.Project };
      const data = {
        id: current.id,
        billable: current.billable,
        time: current.time / 60,
        milestone: current.Milestone,
        task: current.Task,
        comments: current.comments,
      };
      const projectObj = { id: current.Project.id, name: current.Project.name, client: current.Project.Client };
      if (check && prev[currentDateStr]) {
        const previous = prev[currentDateStr];
        let index = previous.projectsLog.findIndex((obj) => obj?.project?.id === project?.id);
        if (index > -1) {
          previous.projectsLog[index]?.data.push(data);
          previous.projectsLog[index].total += current?.time / 60;
          previous.dayTotal += current.time / 60;
        } else check && previous.projectsLog?.push({ project: projectObj, data: [data], total: current?.time / 60 });
      } else if (check)
        prev[currentDateStr] = {
          dayTotal: current?.time / 60,
          projectsLog: [{ project: projectObj, data: [data], total: current?.time / 60 }],
        };

      return prev;
    }, {});

    return new Response(JSON.stringify(restructuredData));
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
