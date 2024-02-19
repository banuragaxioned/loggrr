import { db } from "@/server/db";
import { subDays } from "date-fns";

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

export const getMilestones = async (projectId: number, team: string ) => {
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
    id: milestone.id,
    name: milestone.name,
    budget: milestone.budget,
    startDate: milestone.startDate,
    endDate: milestone.endDate,
  }));
}

export const teamMemberStats = async (team: string, project: number) => {
  const teamMembers = await db.$transaction([
    db.timeEntry.groupBy({
      by: ["userId"],
      where: {
        workspace: {
          slug: team,
        },
        projectId: +project,
        // get current 30 days
        date: {
          gte: subDays(new Date(), 30),
        },
      },
      orderBy: {
        _count: {
          userId: "asc",
        },
      },
    }),
    db.timeEntry.groupBy({
      by: ["userId"],
      where: {
        workspace: {
          slug: team,
        },
        projectId: +project,
        // get last 30 days
        date: {
          gte: subDays(new Date(), 60),
          lte: subDays(new Date(), 30),
        },
      },
      orderBy: {
        _count: {
          userId: "asc",
        },
      },
    }),
  ]);

  return teamMembers
}
