import { db } from "@/server/db";
import { endOfDay, startOfDay } from "date-fns";

// get time logged by the user for a specific date range
export const getLoggedTime = async (
  slug: string,
  startDate: Date,
  endDate: Date,
  userId?: number,
  billable?: boolean,
) => {
  const start = startOfDay(startDate);
  const end = endOfDay(endDate);

  const response = await db.timeEntry.aggregate({
    where: {
      userId,
      workspace: {
        slug,
      },
      billable,
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
