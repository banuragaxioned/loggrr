import { prisma } from "../db";
import { db } from "@/lib/db";

export const getMembers = async (slug: string, projectId: number) => {
  const members = await prisma.project.findMany({
    where: { Tenant: { slug }, id: +projectId },
    select: {
      Members: { select: { id: true, name: true, image: true } },
      Owner: { select: { id: true, name: true, image: true } },
    },
  });

  return members;
};

export async function getProjects(slug: string) {
  const projects = await db.project.findMany({
    where: { Tenant: { slug } },
    select: {
      id: true,
      name: true,
      billable: true,
      interval: true,
      Client: { select: { id: true, name: true } },
      Owner: { select: { id: true, name: true, image: true } },
      status: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return projects;
}

export async function getProjectSummary(slug: string) {
  const summary = await db.client.findMany({
    where: { Tenant: { slug } },
    select: {
      id: true,
      name: true,
      Project:{
        select:{
          id:true,
          name:true,
          Owner:{select:{id:true,name:true,image:true}},
          Milestone:{select:{id:true,budget:true,projectId:true}},
          TimeEntry:{select:{id:true,time:true,projectId:true}}
        }
      }
    },
    orderBy: {
      name: "asc",
    },
  });

  return summary;
}

export async function getClients(slug: string) {
  const clients = await db.client.findMany({
    where: { Tenant: { slug } },
    select: {
      id: true,
      name: true,
      status: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return clients;
}

export async function getAssignments(slug: string) {
  const assignments = await db.allocation.findMany({
    where: { Tenant: { slug } },
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
