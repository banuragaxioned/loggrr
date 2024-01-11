"use server";

import { checkRole } from "@/lib/access";
import { db } from "@/db";
import { z } from "zod";

const timeEntry = z.object({
  date: z.date(),
  projectId: z.number(),
  milestoneId: z.number(),
  comment: z.string().optional(),
});

type Form = z.infer<typeof timeEntry>;

export async function createTimeLog(data: Form, slug: string, userId: number, time: number) {
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
          id: data.projectId,
        },
      },
      Milestone: {
        connect: {
          id: data.milestoneId,
        },
      },
      comments: data.comment,
    },
  });

  return { success: true };
}
