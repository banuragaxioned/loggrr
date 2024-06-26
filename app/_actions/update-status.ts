"use server";

import { db } from "@/server/db";
import { Status } from "@prisma/client";

export async function updateMilestoneStatus(team: string, project: number, id: number, status: Status) {
  const milestones = await db.milestone.update({
    where: {
      id,
      project: {
        id: project,
      },
      workspace: {
        slug: team,
      },
    },
    data: {
      status,
    },
  });

  return milestones;
}

export async function updateTaskStatus(team: string, project: number, id: number, status: Status) {
  const tasks = await db.task.update({
    where: {
      id,
      project: {
        id: project,
      },
      workspace: {
        slug: team,
      },
    },
    data: {
      status,
    },
  });

  return tasks;
}
