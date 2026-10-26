"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { TIMEZONE_COOKIE } from "@/lib/date";

/*
 * Stores the browser's time zone in a cookie so server components can work out
 * the viewer's "today". Refreshes once when the zone is first set or changes.
 */
export function TimezoneSync() {
  const router = useRouter();

  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!timeZone) return;

    const encoded = encodeURIComponent(timeZone);
    const current = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${TIMEZONE_COOKIE}=`))
      ?.split("=")[1];

    if (current === encoded) return;

    document.cookie = `${TIMEZONE_COOKIE}=${encoded}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }, [router]);

  return null;
}
