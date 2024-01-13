"use server";

import { db } from "@/server/db";
import { z } from "zod";

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
          slug: slug,
        },
      },
      date: data.date,
      time: time,
      user: {
        connect: {
          id: userId,
        },
      },
      project: {
        connect: {
          id: +data.projectId,
        },
      },
      milestone: {
        connect: {
          id: +data.milestoneId,
        },
      },
      comments: data.comment,
    },
  });

  return { success: true };
}
