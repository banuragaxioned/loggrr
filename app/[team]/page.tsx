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
import { endOfWeek, format, parse, startOfWeek } from "date-fns";

export default async function Dashboard(props: pageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const user = await getCurrentUser();
  const { team } = params;

  if (!user) {
    return notFound();
  }

  const dateParam = typeof searchParams.date === "string" ? searchParams.date : undefined;
  const date = dateParam ? parse(dateParam, "yyyy-MM-dd", new Date()) : new Date();
  const projects = await getAllProjects(user.id, team);
  const loggedTime = await getTimelogLastWeek(team, user.id, date);
  const recentTimeEntries = await getRecentEntries(team, user.id);
  const sevenWeekTimeEntries = await getWeekWiseEntries(team, user.id, 7);
  const maxHourPerDay = 7.5;
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 0 });
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
          <WeekHeatmap sevenWeekTimeEntries={sevenWeekTimeEntries} selectedDate={date} />
        </>
      }
    >
      <TimeEntry
        team={team}
        projects={projects ? projects : []}
        recentTimeEntries={recentTimeEntries}
        initialDate={date}
      />
    </DashboardShell>
  );
}
