"use server";

import { z } from "zod";
import { db } from "@/server/db";

const timeEntry = z.object({
  date: z.date(),
  projectId: z.string(),
  milestoneId: z.string(),
  comment: z.string().optional(),
});

type Form = z.infer<typeof timeEntry>;

export async function createTimeLog(data: Form, slug: string, userId: number, time: number) {
  await db.timeEntry.create({
    data: {
      workspace: {
        connect: {
          slug,
        },
      },
      date: data.date,
      time,
      user: {
        connect: {
          id: userId,
        },
      },
      project: {
        connect: {
          id: Number(data.projectId),
        },
      },
      milestone: {
        connect: {
          id: Number(data.milestoneId),
        },
      },
      comments: data.comment,
    },
  });

  return { success: true };
}
