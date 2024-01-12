import { db } from "@/server/db";

export const getMembersByProjectId = async (slug: string, projectId: number) => {
  const data = await db.project.findUnique({
    where: { Workspace: { slug }, id: +projectId },
    select: {
      Members: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          status: true,
        },
      },
      Owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          status: true,
        },
      },
    },
  });

  const members = data?.Members.map((value) => {
    return {
      id: value.id,
      name: value.name,
      email: value.email,
      image: value.image,
      status: value.status,
      projectId: projectId,
    };
  });

  return members;
};

export async function getProjects(slug: string) {
  const projects = await db.project.findMany({
    where: { Workspace: { slug } },
    select: {
      id: true,
      name: true,
      billable: true,
      interval: true,
      Client: { select: { id: true, name: true } },
      Owner: { select: { id: true, name: true, image: true } },
      Members: { select: { id: true, name: true, image: true } },
      Milestone: {
        select: {
          budget: true,
        },
      },
      TimeEntry: {
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
    clientName: project.Client.name,
    owner: project.Owner.name,
    ownerImage: project.Owner.image,
    members: project.Members,
    status: project.status,
    budget: project.Milestone.map((obj) => obj.budget).reduce((prev, current) => prev + current, 0),
    logged: project.TimeEntry.map((obj) => obj.time).reduce((prev, current) => prev + current, 0),
  }));

  return projectList;
}

export async function getProjectSummary(slug?: string, userId?: number) {
  const summary = await db.project.findMany({
    where: { Workspace: { slug } },
    select: {
      id: true,
      name: true,
      billable: true,
      Client: { select: { id: true, name: true } },
      Owner: { select: { id: true, name: true, image: true } },
      Milestone: { select: { id: true, budget: true, projectId: true, name: true } },
      TimeEntry: { select: { id: true, time: true, projectId: true } },
      Members: { select: { id: true, name: true } },
      Task: { select: { id: true, name: true } },
    },
    orderBy: {
      name: "asc",
    },
  });

  return userId
    ? summary
        .filter((project) => project.Members.find((member) => member.id === userId))
        .map((project) => ({
          id: project.id,
          name: project.name,
          milestone: project.Milestone.map((milestone) => ({ id: milestone.id, name: milestone.name })),
          task: project.Task.map((task) => ({ id: task.id, name: task.name })),
        }))
    : summary.map((project) => ({
        id: project.id,
        name: project.name,
        billable: project.billable,
        clientId: project.Client.id,
        clientName: project.Client.name,
        projectOwner: project.Owner.name,
        projectOwnerAvatar: project.Owner.image,
        budget: project.Milestone.length
          ? project.Milestone.filter((item) => item.projectId === project.id)[0].budget
          : 0,
        logged: project.TimeEntry.length
          ? project.TimeEntry.filter((item) => item.projectId === project.id)[0].time
          : 0,
      }));
}

export async function getClients(slug: string) {
  const clients = await db.client.findMany({
    where: { Workspace: { slug } },
    select: {
      id: true,
      name: true,
      status: true,
      Project: {
        distinct: "name",
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return clients.map((client) => ({ ...client, Project: client.Project.length }));
}

export async function getAssignments(slug: string) {
  const assignments = await db.allocation.findMany({
    where: { Workspace: { slug } },
    select: {
      id: true,
      date: true,
      enddate: true,
      billableTime: true,
      nonBillableTime: true,
      Project: { select: { id: true, name: true } },
      User: { select: { id: true, name: true, image: true } },
      frequency: true,
      status: true,
    },
    orderBy: {
      User: {
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
    projectId: assignment.Project.id,
    projectName: assignment.Project.name,
    userId: assignment.User.id,
    userName: assignment.User.name,
    userImage: assignment.User.image,
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
      Project: true,
      projectId: true,
      frequency: true,
      date: true,
      enddate: true,
    },
  });
  const requiredAllocation = getAllocationData.find((obj) => obj.projectId === project && obj.userId === user);
  // console.log(new Date(requiredAllocation[0].date),new Date(startDate).getDate())
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
      Project: {
        select: {
          id: true,
          name: true,
          billable: true,
          Client: { select: { id: true, name: true } },
          Milestone: { select: { id: true, budget: true, projectId: true, name: true } },
          TimeEntry: { select: { id: true, time: true, projectId: true } },
          Task: { select: { id: true, name: true } },
        },
      },
    },
  });
  return projects?.Project.map((project) => ({
    id: project.id,
    name: project.name,
    billable: project.billable,
    milestone: project.Milestone.map((milestone) => ({ id: milestone.id, name: milestone.name })),
    task: project.Task.map((task) => ({ id: task.id, name: task.name })),
    client: project.Client,
  }));
};
