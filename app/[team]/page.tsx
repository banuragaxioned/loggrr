import { notFound } from "next/navigation";

import { getCurrentUser } from "@/server/session";
import { getAllProjects } from "@/server/services/project";
import { getRecentEntries, getTimelogLastWeek, getWeekWiseEntries } from "@/server/services/time-entry";

import { pageProps } from "@/types";
import { getTimeInHours } from "@/lib/helper";

import { TimeEntry } from "@/components/time-entry";
import { DashboardShell } from "@/components/dashboard-shell";
import CategoryDataBar from "@/components/charts/category-bar";
import WeekHeatmap from "@/components/charts/week-heatmap";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { fromDateKey, isDateKey, toDateKey } from "@/lib/date";
import { getRequestTodayKey } from "@/server/timezone";

export default async function Dashboard(props: pageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const user = await getCurrentUser();
  const { team } = params;

  if (!user) {
    return notFound();
  }

  // Selected day as a "yyyy-MM-dd" key; defaults to the viewer's today (from their time zone cookie)
  const todayKey = await getRequestTodayKey();
  const dateKey = isDateKey(searchParams.date) ? searchParams.date : todayKey;
  const date = fromDateKey(dateKey);
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 0 });
  const projects = await getAllProjects(user.id, team);
  const loggedTime = await getTimelogLastWeek(team, user.id, toDateKey(weekStart), toDateKey(weekEnd));
  const recentTimeEntries = await getRecentEntries(team, user.id);
  const sevenWeekTimeEntries = await getWeekWiseEntries(team, user.id, 7);
  const maxHourPerDay = 7.5;
  const weekHours = {
    title: "Hours logged",
    subtitle: `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d")}`,
    markerValue: getTimeInHours(loggedTime),
    maxValue: maxHourPerDay * 5,
  };

  return (
    <DashboardShell
      aside={
        <>
          <CategoryDataBar
            title={weekHours.title}
            subtitle={weekHours.subtitle}
            markerValue={weekHours.markerValue}
            maxValue={weekHours.maxValue}
            type="hours"
          />
          <WeekHeatmap sevenWeekTimeEntries={sevenWeekTimeEntries} selectedDateKey={dateKey} todayKey={todayKey} />
        </>
      }
    >
      <TimeEntry
        team={team}
        projects={projects ? projects : []}
        recentTimeEntries={recentTimeEntries}
        initialDateKey={dateKey}
      />
    </DashboardShell>
  );
}
