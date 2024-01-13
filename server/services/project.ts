import { db } from "@/server/db";

export const getMembersByProjectId = async (slug: string, projectId: number) => {
  const data = await db.project.findUnique({
    where: { workspace: { slug }, id: +projectId },
    select: {
      usersOnProject: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              status: true,
            },
          },
        },
      },
      // Owner: {
      //   select: {
      //     id: true,
      //     name: true,
      //     email: true,
      //     image: true,
      //     status: true,
      //   },
      // },
    },
  });

  const members = data?.usersOnProject.map((value) => {
    return {
      id: value.user.id,
      name: value.user.name,
      email: value.user.email,
      image: value.user.image,
      status: value.user.status,
      projectId: projectId,
    };
  });

  return members;
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
      },
      status: true,
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
    budget: project.milestone.map((obj) => obj.budget).reduce((prev, current) => prev + current, 0),
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

export async function getAssignments(slug: string) {
  const assignments = await db.allocation.findMany({
    where: { workspace: { slug } },
    select: {
      id: true,
      date: true,
      enddate: true,
      billableTime: true,
      nonBillableTime: true,
      project: { select: { id: true, name: true } },
      user: { select: { id: true, name: true, image: true } },
      frequency: true,
      status: true,
    },
    orderBy: {
      user: {
        name: "asc",
      },
    },
  });

  // flatten Project and User assignments array
  const flattenedAssignments = assignments.map((assignment) => ({
    id: assignment.id,
    date: assignment.date,
    enddate: assignment.enddate,
    billableTime: assignment.billableTime,
    nonBillableTime: assignment.nonBillableTime,
    projectId: assignment.project.id,
    projectName: assignment.project.name,
    userId: assignment.user.id,
    userName: assignment.user.name,
    userImage: assignment.user.image,
    frequency: assignment.frequency,
    status: assignment.status,
  }));

  return flattenedAssignments;
}

const updatedAllocation = async (requiredAllocation: any, data: any, range: any) => {
  const { total, billable, nonBillable } = data;
  const { from, to, onGoing } = range;
  return await db.allocation.update({
    where: {
      id: requiredAllocation?.id,
    },
    data: {
      //key:updated value
      billableTime: billable,
      nonBillableTime: nonBillable,
      frequency: onGoing ? "ONGOING" : "DAY",
      date: from,
      enddate: to,
      updatedAt: new Date(),
    },
  });
};

const insertAllocation = async (requiredAllocation: any, data: any, range: any, userId: number, projectId: number) => {
  const { total, billable, nonBillable } = data;
  const { from, to, onGoing } = range;
  return await db.allocation.create({
    data: {
      projectId: projectId,
      billableTime: billable,
      nonBillableTime: nonBillable,
      frequency: onGoing ? "ONGOING" : "DAY",
      date: from,
      enddate: to,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: userId,
      workspaceId: 1,
    },
  });
};

export const updateAssignedHours = async (startDate: any, data: any, range: any, project: number, user: number) => {
  const { total, billable, nonBillable } = data;
  const { from, to, onGoing } = range;
  const getAllocationData = await db.allocation.findMany({
    select: {
      id: true,
      userId: true,
      project: true,
      projectId: true,
      frequency: true,
      date: true,
      enddate: true,
    },
  });
  const requiredAllocation = getAllocationData.find((obj) => obj.projectId === project && obj.userId === user);
  requiredAllocation
    ? await updatedAllocation(requiredAllocation, data, range)
    : await insertAllocation(requiredAllocation, data, range, project, user);
};

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

export const getAllUserProjects = async (userId: number) => {
  const projects = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      usersOnProject: {
        select: {
          project: {
            select: {
              id: true,
              name: true,
              billable: true,
              client: { select: { id: true, name: true } },
              milestone: { select: { id: true, budget: true, projectId: true, name: true } },
              timeEntry: { select: { id: true, time: true, projectId: true } },
              task: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
  });
  return projects?.usersOnProject.map((projectList) => ({
    id: projectList.project.id,
    name: projectList.project.name,
    billable: projectList.project.billable,
    milestone: projectList.project.milestone.map((milestone) => ({ id: milestone.id, name: milestone.name })),
    task: projectList.project.task.map((task) => ({ id: task.id, name: task.name })),
    client: projectList.project.client,
  }));
};