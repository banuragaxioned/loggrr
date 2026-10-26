import { cookies } from "next/headers";

import { TIMEZONE_COOKIE, isValidTimeZone, todayKeyIn } from "@/lib/date";

// The viewer's IANA time zone, written by <TimezoneSync /> from the browser.
export const getRequestTimeZone = async () => {
  const value = (await cookies()).get(TIMEZONE_COOKIE)?.value;
  const timeZone = value ? decodeURIComponent(value) : undefined;
  return isValidTimeZone(timeZone) ? timeZone : undefined;
};

// Today's date key for the viewer, so server-rendered "today" matches their calendar.
export const getRequestTodayKey = async () => todayKeyIn(await getRequestTimeZone());
