import { isValid, parse, startOfMonth, subDays } from "date-fns";

import { dateKeyToDb, dbToDateKey, fromDateKey, toDateKey } from "@/lib/date";

type StartEnd = {
  startDate: Date;
  endDate: Date;
};

const RANGE_FORMAT = "MM-dd-yyyy";

// One side of the URL range ("MM-dd-yyyy") → local midnight, or null if invalid.
// Don't use new Date(value): Safari returns Invalid Date for this format.
export const parseRangeDay = (value?: string) => {
  if (!value) return null;
  const date = parse(value, RANGE_FORMAT, new Date());
  return isValid(date) ? date : null;
};

// Day → UTC midnight, matching how time entry dates are stored
const toDbDay = (date: Date) => dateKeyToDb(toDateKey(date));

/*
 * range: "MM-dd-yyyy,MM-dd-yyyy" from the URL.
 * todayKey: the viewer's today ("yyyy-MM-dd"), used for the default range.
 * Returns inclusive bounds as UTC-midnight days.
 */
export function getStartandEndDates(range: string, defaultDay?: number, todayKey = toDateKey(new Date())): StartEnd {
  if (range) {
    const [start, end] = range.split(",").map(parseRangeDay);

    if (start && end) {
      return { startDate: toDbDay(start), endDate: toDbDay(end) };
    }
  }

  const today = fromDateKey(todayKey);

  return {
    startDate: toDbDay(defaultDay ? subDays(today, defaultDay) : startOfMonth(today)),
    endDate: dateKeyToDb(todayKey),
  };
}

// Fixed-interval projects default to "since the project was created"
export function getProjectLifetimeRange(createdAt: Date | null | undefined, todayKey: string): StartEnd {
  return {
    startDate: createdAt ? dateKeyToDb(dbToDateKey(createdAt)) : toDbDay(startOfMonth(fromDateKey(todayKey))),
    endDate: dateKeyToDb(todayKey),
  };
}
