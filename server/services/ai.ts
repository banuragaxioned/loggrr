import { db } from "@/server/db";
import { endOfDay, startOfDay, subDays } from "date-fns";

// get time logged by the user for a specific date range
export const getLoggedTime = async (slug: string, userId: number, startDate: Date, endDate: Date) => {
  const start = startOfDay(startDate);
  const end = endOfDay(endDate);

  const response = await db.timeEntry.groupBy({
    by: ["projectId"],
    orderBy: {
      projectId: "asc",
    },
    where: {
      userId,
      workspace: {
        slug,
      },
      date: {
        gte: start,
        lte: end,
      },
    },
    _sum: {
      time: true,
    },
  });

  return response;
};
