import { endOfDay, startOfDay, subDays } from "date-fns";

import { db } from "@/server/db";
import { getTimeInHours, stringToBoolean } from "@/lib/helper";

// Get project details by project id
export const getProjectDetailsById = async (slug: string, projectId: number) => {
  const projectDetails = await db.project.findUnique({
    where: {
      id: +projectId,
      workspace: {
        slug,
      },
    },
    select: {
      name: true,
      client: {
        select: {
          name: true,
        },
      },
      billable: true,
    },
  });

  return projectDetails;
};

// Get all members in the project
export const getMembersByProject = async (slug: string, projectId: number) => {
  const members = await db.project.findUnique({
    where: {
      id: +projectId,
      workspace: {
        slug,
      },
    },
    select: {
      usersOnProject: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            },
          },
        },
        orderBy: {
          user: {
            name: "asc",
          },
        },
      },
    },
  });

  const transformedData = members?.usersOnProject
    .filter((member) => member.user.name || member.user.image)
    .map((member) => ({
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
      image: member.user.image,
    }));

  return transformedData;
};

// Get all members time entries from TimeEntry table
export const getMembersTimeEntries = async (
  slug: string,
  projectId: number,
  startDate: Date,
  endDate: Date,
  billing?: string,
) => {
  const start = startOfDay(startDate);
  const end = endOfDay(endDate);
  const isBillable = stringToBoolean(billing);

  const timeEntries = await db.timeEntry.groupBy({
    by: ["date"],
    where: {
      workspace: {
        slug,
      },
      projectId,
      date: {
        gte: start,
        lte: end,
      },
      billable: {
        ...(isBillable !== null && { equals: isBillable }),
      },
    },
    _sum: {
      time: true,
    },
  });

  const formattedEntries = timeEntries.map((entry) => ({
    date: entry.date,
    time: entry._sum.time ?? 0,
  }));

  const billableTimeEntries = await db.timeEntry.groupBy({
    by: ["date"],
    where: {
      workspace: {
        slug,
      },
      projectId,
      date: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      billable: true,
    },
    _sum: {
      time: true,
    },
  });

  const formattedBillableEntries = billableTimeEntries.map((entry) => ({
    date: entry.date,
    time: entry._sum.time ?? 0,
  }));

  return { timeEntries: formattedEntries, billableEntries: formattedBillableEntries };
};

// Get all members time entries grouped by name
export const getMemberEntriesGroupedByName = async (
  slug: string,
  projectId: number,
  startDate: Date,
  endDate: Date,
  billing?: string,
) => {
  const start = startOfDay(startDate);
  const end = endOfDay(endDate);
  const isBillable = stringToBoolean(billing);

  const userEntries = await db.timeEntry.findMany({
    where: {
      workspace: {
        slug,
      },
      projectId,
      date: {
        gte: start,
        lte: end,
      },
      billable: {
        ...(isBillable !== null && { equals: isBillable }),
      },
    },
    select: {
      date: true,
      time: true,
      userId: true,
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      comments: true,
      task: {
        select: {
          name: true,
        },
      },
      milestone: {
        select: {
          name: true,
        },
      },
      billable: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  // Group the time entries by user
  const groupedByUsers = userEntries.reduce((acc: any, entry: any) => {
    const userId = `${entry.userId}`;
    if (!acc[userId]) {
      const userHours = userEntries
        .filter((userEntry) => userEntry.userId === entry.userId)
        .reduce((prev, current) => prev + current.time, 0);

      acc[userId] = {
        id: +userId,
        name: entry.user.name,
        image: entry.user.image,
        hours: getTimeInHours(userHours),
        subRows: [],
      };
    }

    acc[userId].subRows.push({
      name: entry.date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      hours: getTimeInHours(entry.time),
      comments: entry.comments,
      task: entry.task,
      milestone: entry.milestone,
      billable: entry.billable,
    });

    return acc;
  }, {});

  const result = Object.values(groupedByUsers).sort((a: any, b: any) => a.name.localeCompare(b.name));

  return { memberEntries: result };
};

export async function getProjects(slug: string) {
  const projects = await db.project.findMany({
    where: { workspace: { slug } },
    select: {
      id: true,
      name: true,
      billable: true,
      interval: true,
      client: { select: { id: true, name: true } },
      owner: { select: { id: true, name: true, image: true } },
      usersOnProject: {
        select: {
          user: { select: { id: true, name: true, image: true } },
        },
      },
      milestone: {
        select: {
          budget: true,
        },
      },
      timeEntry: {
        select: {
          time: true,
        },
        where: {
          date: {
            gte: subDays(new Date(), 30),
          },
        },
      },
      status: true,
      budget: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const projectList = projects.map((project) => ({
    id: project.id,
    name: project.name,
    billable: project.billable,
    interval: project.interval,
    clientName: project.client.name,
    owner: project.owner.name,
    ownerImage: project.owner.image,
    members: project.usersOnProject,
    status: project.status,
    budget: project.budget,
    logged: project.timeEntry.map((obj) => obj.time).reduce((prev, current) => prev + current, 0),
  }));

  return projectList;
}

export async function getProjectSummary(slug?: string, userId?: number) {
  const summary = await db.project.findMany({
    where: { workspace: { slug } },
    select: {
      id: true,
      name: true,
      billable: true,
      client: { select: { id: true, name: true } },
      owner: { select: { id: true, name: true, image: true } },
      milestone: { select: { id: true, budget: true, projectId: true, name: true } },
      timeEntry: { select: { id: true, time: true, projectId: true } },
      usersOnProject: {
        select: {
          user: { select: { id: true, name: true, image: true } },
        },
      },
      task: { select: { id: true, name: true } },
    },
    orderBy: {
      name: "asc",
    },
  });

  return userId
    ? summary
        .filter((project) => project.usersOnProject.find((member) => member.user.id === userId))
        .map((project) => ({
          id: project.id,
          name: project.name,
          milestone: project.milestone.map((milestone) => ({ id: milestone.id, name: milestone.name })),
          task: project.task.map((task) => ({ id: task.id, name: task.name })),
        }))
    : summary.map((project) => ({
        id: project.id,
        name: project.name,
        billable: project.billable,
        clientId: project.client.id,
        clientName: project.client.name,
        projectOwner: project.owner.name,
        projectOwnerAvatar: project.owner.image,
        budget: project.milestone.length
          ? project.milestone.filter((item) => item.projectId === project.id)[0].budget
          : 0,
        logged: project.timeEntry.length
          ? project.timeEntry.filter((item) => item.projectId === project.id)[0].time
          : 0,
      }));
}

export async function getClients(slug: string) {
  const clients = await db.client.findMany({
    where: { workspace: { slug } },
    select: {
      id: true,
      name: true,
      status: true,
      project: {
        distinct: "name",
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return clients.map((client) => ({ ...client, project: client.project.length }));
}

export async function projectAccess(projectId: number) {
  const hasAccess = await db.project.findUnique({
    select: {
      id: true,
      name: true,
      status: true,
    },
    where: {
      id: +projectId,
    },
  });

  return hasAccess;
}

export const getAllProjects = async (userId?: number, team?: string) => {
  if (!userId) return [];

  const projects = await db.project.findMany({
    where: {
      usersOnProject: {
        some: {
          userId,
        },
      },
      ...(team && {
        workspace: {
          slug: team,
        },
      }),
    },
    select: {
      id: true,
      name: true,
      billable: true,
      client: { select: { id: true, name: true } },
      milestone: { select: { id: true, budget: true, projectId: true, name: true } },
      timeEntry: { select: { id: true, time: true, projectId: true } },
      task: { select: { id: true, name: true } },
      workspace: { select: { slug: true } },
    },
    orderBy: {
      name: "asc",
    },
  });

  return projects?.map((project) => ({
    id: project.id,
    name: project.name,
    billable: project.billable,
    milestone: project.milestone.map((milestone) => ({ id: milestone.id, name: milestone.name })),
    task: project.task.map((task) => ({ id: task.id, name: task.name })),
    client: project.client,
    workspace: project.workspace.slug,
  }));
};

export const getMilestones = async (projectId: number, team: string) => {
  const milestoneList = await db.milestone.findMany({
    where: {
      workspace: {
        slug: team,
      },
      project: {
        id: +projectId,
      },
    },
  });

  return milestoneList.map((milestone) => ({
    id: milestone?.id,
    name: milestone.name,
    budget: milestone.budget,
  }));
};

export const getTasks = async (projectId: number, team: string) => {
  const tasks = await db.task.findMany({
    where: {
      workspace: {
        slug: team,
      },
      project: {
        id: +projectId,
      },
    },
    select: {
      id: true,
      name: true,
      budget: true,
    },
  });

  return tasks.map((task) => ({
    id: task.id,
    name: task.name,
    budget: task.budget,
  }));
};
