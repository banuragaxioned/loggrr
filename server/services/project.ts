import { endOfDay, startOfDay, subDays } from "date-fns";

import { db } from "@/server/db";
import { formatEntryDate, getTimeInHours, stringToBoolean } from "@/lib/helper";

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
  members?: string,
  category?: string,
  task?: string,
) => {
  const start = startOfDay(startDate);
  const end = endOfDay(endDate);
  const isBillable = stringToBoolean(billing);
  const categoryTaskFilter = [buildFkFilter(category, "milestoneId"), buildFkFilter(task, "taskId")].filter(Boolean);

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
      ...(members && {
        userId: {
          in: members.split(",").map((member) => +member),
        },
      }),
      ...(categoryTaskFilter.length ? { AND: categoryTaskFilter } : {}),
    },
    _sum: {
      time: true,
    },
  });

  const formattedEntries = timeEntries.map((entry) => ({
    date: entry.date,
    time: entry._sum.time ?? 0,
  }));

  return { timeEntries: formattedEntries };
};

interface TimeEntry {
  id: number;
  date: Date;
  time: number;
  userId: number;
  user: {
    name: string | null;
    image: string | null;
  };
  comments: string;
  task: {
    id: number;
    name: string;
  } | null;
  milestone: {
    id: number;
    name: string;
  } | null;
  billable: boolean;
  createdAt: Date;
}

interface GroupedUser {
  id: number;
  name: string;
  image: string | null;
  hours: number;
  subRows: Array<{
    id: number;
    name: string;
    hours: number;
    comments: string | null;
    task: TimeEntry["task"];
    milestone: TimeEntry["milestone"];
    billable: boolean;
    date: Date;
    createdAt: Date;
  }>;
}

interface GroupedUsers {
  [key: string]: GroupedUser;
}

export const getMemberEntriesGroupedByName = async (
  slug: string,
  projectId: number,
  startDate: Date,
  endDate: Date,
  billing?: string,
  members?: string,
  category?: string,
  task?: string,
) => {
  const start = startOfDay(startDate);
  const end = endOfDay(endDate);
  const isBillable = stringToBoolean(billing);
  const categoryTaskFilter = [buildFkFilter(category, "milestoneId"), buildFkFilter(task, "taskId")].filter(Boolean);

  // Optimize query by pre-aggregating user totals
  const [userEntries, userTotals] = await Promise.all([
    db.timeEntry.findMany({
      where: {
        workspace: { slug },
        projectId,
        date: { gte: start, lte: end },
        ...(isBillable !== null && { billable: { equals: isBillable } }),
        ...(members && {
          userId: { in: members.split(",").map(Number) },
        }),
        ...(categoryTaskFilter.length ? { AND: categoryTaskFilter } : {}),
      },
      select: {
        id: true,
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
            id: true,
            name: true,
          },
        },
        milestone: {
          select: {
            id: true,
            name: true,
          },
        },
        billable: true,
        createdAt: true,
      },
      orderBy: [{ date: "desc" }, { createdAt: "asc" }],
    }),
    db.timeEntry.groupBy({
      by: ["userId"],
      where: {
        workspace: { slug },
        projectId,
        date: { gte: start, lte: end },
        ...(isBillable !== null && { billable: { equals: isBillable } }),
        ...(members && {
          userId: { in: members.split(",").map(Number) },
        }),
        ...(categoryTaskFilter.length ? { AND: categoryTaskFilter } : {}),
      },
      _sum: {
        time: true,
      },
    }),
  ]);

  // Convert user totals to a Map for O(1) lookup
  const userTotalHours = new Map(userTotals.map((total) => [total.userId, total._sum.time || 0]));

  // Group the time entries by user with pre-calculated totals
  const groupedByUsers = userEntries.reduce<GroupedUsers>((acc, entry) => {
    const userId = `${entry.userId}`;

    if (!acc[userId]) {
      acc[userId] = {
        id: entry.userId,
        name: entry.user.name || "Unknown User",
        image: entry.user.image,
        hours: getTimeInHours(userTotalHours.get(entry.userId) || 0),
        subRows: [],
      };
    }

    acc[userId].subRows.push({
      id: entry.id,
      name: formatEntryDate(entry.date),
      hours: getTimeInHours(entry.time),
      comments: entry.comments,
      task: entry.task,
      milestone: entry.milestone,
      billable: entry.billable,
      date: entry.date,
      createdAt: entry.createdAt,
    });

    // Sort subRows by date (desc) and createdAt (asc)
    acc[userId].subRows.sort((a, b) => {
      const dateCompare = b.date.getTime() - a.date.getTime();
      if (dateCompare === 0) {
        return a.createdAt.getTime() - b.createdAt.getTime();
      }
      return dateCompare;
    });

    return acc;
  }, {});

  const result = Object.values(groupedByUsers).sort((a: any, b: any) => a.name.localeCompare(b.name));

  return { memberEntries: result };
};

// Get all members name from time entries
export const getMembersNameInTimeEntries = async (slug: string, projectId: number) => {
  const result = await db.timeEntry.findMany({
    distinct: ["userId"],
    where: {
      workspace: {
        slug,
      },
      projectId,
    },
    select: {
      user: {
        select: {
          id: true,
          name: true,
          // role in this workspace — INACTIVE members are grouped separately
          workspaces: {
            where: { workspace: { slug } },
            select: { role: true },
          },
        },
      },
    },
    orderBy: {
      user: {
        name: "asc",
      },
    },
  });

  return result
    .map((item) => ({
      id: item.user.id,
      name: item.user.name,
      archived: item.user.workspaces[0]?.role === "INACTIVE",
    }))
    .sort(byArchived);
};

// Active first, then archived — used to group the Category/Task filters.
const isArchived = (status: string) => status === "ARCHIVED" || status === "DEACTIVATED";
const byArchived = (a: { archived: boolean }, b: { archived: boolean }) => Number(a.archived) - Number(b.archived);

// Sentinel id used by the "No category" / "No task" filter options.
const NONE_ID = 0;

// Build a Prisma filter for a nullable FK from a comma-separated selection,
// where "0" means "no value set" (uncategorised / no task).
const buildFkFilter = (value: string | undefined, field: "milestoneId" | "taskId") => {
  if (!value) return null;
  const ids = value.split(",");
  const realIds = ids.map(Number).filter((n) => n > 0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conditions: any[] = [];
  if (realIds.length) conditions.push({ [field]: { in: realIds } });
  if (ids.includes(`${NONE_ID}`)) conditions.push({ [field]: null });
  if (!conditions.length) return null;
  return conditions.length === 1 ? conditions[0] : { OR: conditions };
};

// Milestones of a project — surfaced as the "Category" filter on the project page.
// Appends a "No category" option (only when the project has real categories).
export const getMilestonesInProject = async (slug: string, projectId: number) => {
  const result = await db.milestone.findMany({
    where: { workspace: { slug }, projectId },
    select: { id: true, name: true, status: true },
    orderBy: { name: "asc" },
  });

  const milestones = result.map(({ id, name, status }) => ({ id, name, archived: isArchived(status) })).sort(byArchived);
  return milestones.length ? [...milestones, { id: NONE_ID, name: "No category", archived: false }] : [];
};

// Tasks of a project — surfaced as the "Task" filter on the project page.
// Appends a "No task" option (only when the project has real tasks).
export const getTasksInProject = async (slug: string, projectId: number) => {
  const result = await db.task.findMany({
    where: { workspace: { slug }, projectId },
    select: { id: true, name: true, status: true },
    orderBy: { name: "asc" },
  });

  const tasks = result.map(({ id, name, status }) => ({ id, name, archived: isArchived(status) })).sort(byArchived);
  return tasks.length ? [...tasks, { id: NONE_ID, name: "No task", archived: false }] : [];
};

// Summary matrix for a project: category (milestone) > task rows, members who
// logged in range as columns, with row / column / grand totals. Summary only.
export const getProjectMatrix = async (
  slug: string,
  projectId: number,
  startDate: Date,
  endDate: Date,
  billing?: string,
  members?: string,
  category?: string,
  task?: string,
) => {
  const start = startOfDay(startDate);
  const end = endOfDay(endDate);
  const isBillable = stringToBoolean(billing);
  const categoryTaskFilter = [buildFkFilter(category, "milestoneId"), buildFkFilter(task, "taskId")].filter(Boolean);

  const grouped = await db.timeEntry.groupBy({
    by: ["milestoneId", "taskId", "userId"],
    where: {
      workspace: { slug },
      projectId,
      date: { gte: start, lte: end },
      ...(members && { userId: { in: members.split(",").map(Number) } }),
      ...(categoryTaskFilter.length ? { AND: categoryTaskFilter } : {}),
      ...(isBillable !== null && { billable: { equals: isBillable } }),
    },
    _sum: { time: true },
  });

  const userIds = Array.from(new Set(grouped.map((g) => g.userId)));
  const [milestones, tasks, users] = await Promise.all([
    db.milestone.findMany({ where: { workspace: { slug }, projectId }, select: { id: true, name: true } }),
    db.task.findMany({ where: { workspace: { slug }, projectId }, select: { id: true, name: true } }),
    db.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true } }),
  ]);

  const milestoneName = new Map(milestones.map((m) => [m.id, m.name]));
  const taskName = new Map(tasks.map((t) => [t.id, t.name]));
  const userName = new Map(users.map((u) => [u.id, u.name ?? "Unknown"]));

  type Cells = Map<number, number>;
  type TaskRow = { id: string; name: string; cells: Cells; total: number };
  type CategoryRow = { id: string; name: string; cells: Cells; total: number; tasks: Map<string, TaskRow> };

  const categories = new Map<string, CategoryRow>();
  const memberTotals: Cells = new Map();
  let grandTotal = 0;
  const add = (cells: Cells, userId: number, hours: number) =>
    cells.set(userId, +((cells.get(userId) ?? 0) + hours).toFixed(2));

  for (const g of grouped) {
    const hours = getTimeInHours(g._sum.time ?? 0);
    if (!hours) continue;

    const cKey = g.milestoneId != null ? `m-${g.milestoneId}` : "none";
    const cName = g.milestoneId != null ? (milestoneName.get(g.milestoneId) ?? "Unknown") : "Uncategorised";
    let category = categories.get(cKey);
    if (!category) {
      category = { id: cKey, name: cName, cells: new Map(), total: 0, tasks: new Map() };
      categories.set(cKey, category);
    }
    add(category.cells, g.userId, hours);
    category.total = +(category.total + hours).toFixed(2);

    const tKey = g.taskId != null ? `t-${g.taskId}` : "none";
    const tName = g.taskId != null ? (taskName.get(g.taskId) ?? "Unknown") : "No task";
    let task = category.tasks.get(tKey);
    if (!task) {
      task = { id: tKey, name: tName, cells: new Map(), total: 0 };
      category.tasks.set(tKey, task);
    }
    add(task.cells, g.userId, hours);
    task.total = +(task.total + hours).toFixed(2);

    add(memberTotals, g.userId, hours);
    grandTotal = +(grandTotal + hours).toFixed(2);
  }

  const cells = (c: Cells) => Object.fromEntries(c) as Record<number, number>;

  return {
    members: userIds.map((id) => ({ id, name: userName.get(id) ?? "Unknown" })).sort((a, b) => a.name.localeCompare(b.name)),
    grandTotal,
    memberTotals: cells(memberTotals),
    categories: Array.from(categories.values()).map((c) => ({
      id: c.id,
      name: c.name,
      total: c.total,
      cells: cells(c.cells),
      tasks: Array.from(c.tasks.values()).map((t) => ({ id: t.id, name: t.name, total: t.total, cells: cells(t.cells) })),
    })),
  };
};

export async function getProjects(slug: string, status: string = "", clients?: string) {
  const projects = await db.project.findMany({
    where: {
      workspace: { slug },
      ...(status !== "all" && {
        status: { equals: "PUBLISHED" },
      }),
      ...(clients && {
        client: {
          id: {
            in: clients.split(",").map((id) => +id),
          },
        },
      }),
    },
    select: {
      id: true,
      name: true,
      billable: true,
      interval: true,
      client: { select: { id: true, name: true } },
      owner: { select: { id: true, name: true, image: true } },
      status: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    billable: project.billable,
    interval: project.interval,
    clientName: project.client.name,
    clientId: project.client.id,
    owner: project.owner.name,
    ownerImage: project.owner.image,
    status: project.status,
  }));
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
        distinct: "id",
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
      status: "PUBLISHED",
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
      milestone: {
        select: { id: true, budget: true, projectId: true, name: true },
        where: {
          status: "PUBLISHED",
        },
        orderBy: {
          name: "asc",
        },
      },
      // timeEntry: { select: { id: true, time: true, projectId: true } },
      task: {
        select: { id: true, name: true },
        where: { status: "PUBLISHED" },
        orderBy: {
          name: "asc",
        },
      },
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
    select: {
      id: true,
      name: true,
      budget: true,
      status: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return milestoneList;
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
      status: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return tasks;
};
