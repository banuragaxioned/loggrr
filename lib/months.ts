import { format, startOfDay, startOfToday } from "date-fns";

export function getMonthStartAndEndDates(period: string): {
  startDate: Date | null;
  endDate: Date | null;
} {
  const currentDate = new Date();
  let startDate;
  const endDate = new Date();

  if (!period) {
    // Current month
    startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  } else if (period === "last3") {
    // Last 3 months
    const lastMonthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
    startDate = new Date(lastMonthStartDate.getFullYear(), lastMonthStartDate.getMonth(), 1);
  } else if (period === "last6") {
    // Last 6 months
    const lastMonthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1);
    startDate = new Date(lastMonthStartDate.getFullYear(), lastMonthStartDate.getMonth(), 1);
  } else if (period === "last12") {
    // Last 12 months
    const lastMonthStartDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth() + 1, 1);
    startDate = new Date(lastMonthStartDate.getFullYear(), lastMonthStartDate.getMonth(), 1);
  }

  if (startDate && endDate) {
    return {
      startDate,
      endDate,
    };
  }

  return {
    startDate: null,
    endDate: null,
  };
}

type StartEnd = {
  startDate: Date;
  endDate: Date;
};

export function getStartandEndDates(range: string): StartEnd {
  if (range) {
    const [start, end] = range.split(",");

    return {
      startDate: new Date(start),
      endDate: new Date(end),
    };
  }

  return {
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(),
  };
}
