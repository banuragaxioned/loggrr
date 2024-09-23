import { and, asc, eq } from "drizzle-orm";

import dz from ".";
import { project, task, workspace } from "./schema";

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
