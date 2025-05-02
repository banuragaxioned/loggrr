import { client, project, timeLog, user, member, estimate, category } from "../schema";
import { db } from "..";
import { eq, and } from "drizzle-orm";

export const getClients = async (organizationId: string) => {
  return await db
    .select({
      id: client.id,
      name: client.name,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    })
    .from(client)
    .where(eq(client.organizationId, organizationId));
};

export const createClient = async (organizationId: string, name: string) => {
  return await db.insert(client).values({ organizationId, name });
};

export const getProjects = async (organizationId: string) => {
  return await db
    .select({
      id: project.id,
      name: project.name,
      clientId: project.clientId,
      clientName: client.name,
      status: project.status,
      archived: project.archived,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    })
    .from(project)
    .leftJoin(client, eq(project.clientId, client.id))
    .where(eq(project.organizationId, organizationId));
};

export const createProject = async (organizationId: string, name: string, clientId: number) => {
  return await db.insert(project).values({ organizationId, name, clientId });
};

export const getProjectById = async (organizationId: string, id: number) => {
  return await db
    .select({
      id: project.id,
      name: project.name,
      clientId: project.clientId,
      clientName: client.name,
      status: project.status,
      archived: project.archived,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    })
    .from(project)
    .leftJoin(client, eq(project.clientId, client.id))
    .where(and(eq(project.id, id), eq(project.organizationId, organizationId)));
};

export const getTimeLogByProjectId = async (organizationId: string, projectId: number) => {
  return await db
    .select({
      id: timeLog.id,
      projectId: timeLog.projectId,
      projectName: project.name,
      userId: timeLog.memberId,
      userName: user.name,
      startTime: timeLog.startTime,
      endTime: timeLog.endTime,
      duration: timeLog.duration,
      multiplier: timeLog.multiplier,
      createdAt: timeLog.createdAt,
      updatedAt: timeLog.updatedAt,
    })
    .from(timeLog)
    .leftJoin(project, eq(timeLog.projectId, project.id))
    .leftJoin(member, eq(timeLog.memberId, member.id))
    .leftJoin(user, eq(member.userId, user.id))
    .where(and(eq(timeLog.organizationId, organizationId), eq(timeLog.projectId, projectId)));
};
