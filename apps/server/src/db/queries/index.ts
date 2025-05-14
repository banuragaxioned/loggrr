import {
  client,
  project,
  timeLog,
  user,
  member,
  estimate,
  estimateItem,
  position,
  assignment,
  rateCard,
} from "../schema";
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

export const getEstimates = async (organizationId: string) => {
  return await db
    .select({
      id: estimate.id,
      name: estimate.name,
      description: estimate.description,
      status: estimate.status,
      startDate: estimate.startDate,
      endDate: estimate.endDate,
      projectId: estimate.projectId,
      projectName: project.name,
      createdById: estimate.createdById,
      updatedById: estimate.updatedById,
      createdAt: estimate.createdAt,
      updatedAt: estimate.updatedAt,
    })
    .from(estimate)
    .leftJoin(project, eq(estimate.projectId, project.id))
    .where(eq(estimate.organizationId, organizationId));
};

export const getEstimateById = async (organizationId: string, id: number) => {
  return await db
    .select({
      id: estimate.id,
      name: estimate.name,
      description: estimate.description,
      status: estimate.status,
      startDate: estimate.startDate,
      endDate: estimate.endDate,
      projectId: estimate.projectId,
      projectName: project.name,
      createdById: estimate.createdById,
      updatedById: estimate.updatedById,
      createdAt: estimate.createdAt,
      updatedAt: estimate.updatedAt,
    })
    .from(estimate)
    .leftJoin(project, eq(estimate.projectId, project.id))
    .where(and(eq(estimate.id, id), eq(estimate.organizationId, organizationId)));
};

export const createEstimate = async (
  organizationId: string,
  data: {
    name: string;
    description?: string;
    projectId: number;
    startDate: string;
    endDate?: string;
    createdById: string;
    updatedById: string;
  },
) => {
  return await db.insert(estimate).values({
    organizationId,
    ...data,
  });
};

export const getEstimateItems = async (organizationId: string, estimateId: number) => {
  return await db
    .select({
      id: estimateItem.id,
      positionId: estimateItem.positionId,
      positionName: position.name,
      duration: estimateItem.duration,
    })
    .from(estimateItem)
    .leftJoin(position, eq(estimateItem.positionId, position.id))
    .where(and(eq(estimateItem.estimateId, estimateId), eq(estimateItem.organizationId, organizationId)));
};

export const createEstimateItem = async (data: {
  estimateId: number;
  positionId: number;
  duration: number;
  createdById: string;
  updatedById: string;
  organizationId: string;
}) => {
  return await db.insert(estimateItem).values(data).returning();
};

export async function getAssignments(organizationId: string) {
  return await db
    .select({
      id: assignment.id,
      projectId: assignment.projectId,
      projectName: project.name,
      memberId: assignment.memberId,
      memberName: user.name,
      estimateItemId: assignment.estimateItemId,
      positionId: estimateItem.positionId,
      positionName: position.name,
      duration: estimateItem.duration,
    })
    .from(assignment)
    .innerJoin(project, eq(assignment.projectId, project.id))
    .innerJoin(member, eq(assignment.memberId, member.id))
    .innerJoin(user, eq(member.userId, user.id))
    .innerJoin(estimateItem, eq(assignment.estimateItemId, estimateItem.id))
    .innerJoin(position, eq(estimateItem.positionId, position.id))
    .where(eq(assignment.organizationId, organizationId));
}

export async function getAssignmentsByProject(organizationId: string, projectId: number) {
  return await db
    .select({
      id: assignment.id,
      projectId: assignment.projectId,
      projectName: project.name,
      memberId: assignment.memberId,
      memberName: user.name,
      estimateItemId: assignment.estimateItemId,
      positionName: position.name,
      duration: estimateItem.duration,
      organizationId: assignment.organizationId,
      createdById: assignment.createdById,
      updatedById: assignment.updatedById,
      createdAt: assignment.createdAt,
      updatedAt: assignment.updatedAt,
    })
    .from(assignment)
    .innerJoin(project, eq(assignment.projectId, project.id))
    .innerJoin(member, eq(assignment.memberId, member.id))
    .innerJoin(user, eq(member.userId, user.id))
    .innerJoin(estimateItem, eq(assignment.estimateItemId, estimateItem.id))
    .innerJoin(position, eq(estimateItem.positionId, position.id))
    .where(and(eq(assignment.organizationId, organizationId), eq(assignment.projectId, projectId)));
}

export async function createAssignment(
  organizationId: string,
  projectId: number,
  memberId: string,
  estimateItemId: number,
) {
  return await db.insert(assignment).values({
    organizationId,
    projectId,
    memberId,
    estimateItemId,
    createdById: memberId,
    updatedById: memberId,
  });
}

export async function deleteAssignment(organizationId: string, id: number) {
  return await db.delete(assignment).where(and(eq(assignment.id, id), eq(assignment.organizationId, organizationId)));
}

export const getMembers = async (organizationId: string) => {
  return await db
    .select({
      id: member.id,
      organizationId: member.organizationId,
      userId: member.userId,
      role: member.role,
      createdAt: member.createdAt,
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
      },
    })
    .from(member)
    .innerJoin(user, eq(member.userId, user.id))
    .where(eq(member.organizationId, organizationId));
};
