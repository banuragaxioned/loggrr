"use server";

import { checkRole } from "@/lib/access";
import { db } from "@/lib/db";

type TimeEntry = {
  date: Date;
  projectId: number | string;
  milestoneId: number | string;
  comment?: string;
};

export async function createTimeLog(data: TimeEntry, slug: string, userId: number, time: number) {
  const hasAccess = await checkRole(slug);

  if (!hasAccess) {
    return { success: false };
  }

  await db.timeEntry.create({
    data: {
      Workspace: {
        connect: {
          slug: slug,
        },
      },
      date: data.date,
      time: time,
      User: {
        connect: {
          id: userId,
        },
      },
      Project: {
        connect: {
          id: Number(data.projectId),
        },
      },
      Milestone: {
        connect: {
          id: Number(data.milestoneId),
        },
      },
      comments: data.comment,
    },
  });

  return { success: true };
}