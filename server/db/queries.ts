import { and, asc, eq } from "drizzle-orm";

import dz from ".";
import { milestone, project, task, workspace } from "./schema";

export const getMilestones = async (projectId: number, team: string) => {
  const milestones = await dz
    .select({
      id: milestone.id,
      name: milestone.name,
      budget: milestone.budget,
      status: milestone.status,
    })
    .from(milestone)
    .leftJoin(workspace, eq(workspace.id, milestone.workspaceId))
    .leftJoin(project, eq(project.id, milestone.projectId))
    .where(and(eq(workspace.slug, team), eq(project.id, projectId)))
    .orderBy(asc(milestone.name));

  return milestones;
};

export const getTasks = async (projectId: number, team: string) => {
  const tasks = await dz
    .select({
      id: task.id,
      name: task.name,
      budget: task.budget,
      status: task.status,
    })
    .from(task)
    .leftJoin(workspace, eq(workspace.id, task.workspaceId))
    .leftJoin(project, eq(project.id, task.projectId))
    .where(and(eq(workspace.slug, team), eq(project.id, projectId)))
    .orderBy(asc(task.name));

  return tasks;
};
