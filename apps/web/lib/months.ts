import { subDays } from "date-fns";

interface StartEnd {
  startDate: Date;
  endDate: Date;
}

export function getStartandEndDates(range?: string, defaultDay?: number): StartEnd {
  if (range) {
    const [start, end] = range.split(",");

    if (!start || !end)
      return {
        startDate: defaultDay
          ? subDays(new Date(), defaultDay)
          : new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date(),
      };

    return {
      startDate: new Date(start),
      endDate: new Date(end),
    };
  }

  return {
    startDate: defaultDay
      ? subDays(new Date(), defaultDay)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(),
  };
}
