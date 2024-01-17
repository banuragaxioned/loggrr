import { db } from "../db";

export const getTimelogLastWeek = async (slug: string, userId: number) => {
  const response = await db.timeEntry.findMany({
    where: {
      userId: userId,
      date: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
      workspace: {
        slug: slug,
      },
    },
    select: {
      time: true,
      project: {
        select: {
          name: true,
        },
      },
    },
  });
  return response;
};
