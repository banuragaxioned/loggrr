import { format, isValid, parse } from "date-fns";

/*
 * Time entries are calendar days, not instants. They're stored as UTC midnight
 * ("2026-08-04T00:00:00.000Z") and passed around as a "yyyy-MM-dd" date key.
 *
 * Never round-trip a date key through `new Date("yyyy-MM-dd")` — that parses as
 * UTC midnight and shows up as the previous day for anyone west of UTC.
 */

export const DATE_KEY_FORMAT = "yyyy-MM-dd";
export const TIMEZONE_COOKIE = "tz";

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const isDateKey = (value: unknown): value is string =>
  typeof value === "string" && DATE_KEY_PATTERN.test(value) && isValid(parse(value, DATE_KEY_FORMAT, new Date()));

// Local calendar day of a Date → "yyyy-MM-dd". Use for dates picked in the UI.
export const toDateKey = (date: Date) => format(date, DATE_KEY_FORMAT);

// "yyyy-MM-dd" → local midnight. Use for pickers, display and date-fns math.
export const fromDateKey = (key: string) => parse(key, DATE_KEY_FORMAT, new Date());

// "yyyy-MM-dd" → UTC midnight. Use for DB writes and queries.
export const dateKeyToDb = (key: string) => new Date(`${key}T00:00:00.000Z`);

// Stored entry date (Date, or ISO string after JSON) → "yyyy-MM-dd".
export const dbToDateKey = (value: Date | string) => new Date(value).toISOString().slice(0, 10);

// Stored entry date → local midnight of the same calendar day, for display.
export const dbToLocalDate = (value: Date | string) => fromDateKey(dbToDateKey(value));

export const isValidTimeZone = (timeZone: unknown): timeZone is string => {
  if (typeof timeZone !== "string" || !timeZone) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
};

// Today's date key in the given IANA time zone (falls back to the runtime's zone).
export const todayKeyIn = (timeZone?: string) => {
  if (!isValidTimeZone(timeZone)) return toDateKey(new Date());
  // en-CA formats as yyyy-MM-dd
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(
    new Date(),
  );
};
