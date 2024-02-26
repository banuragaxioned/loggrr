import { notFound } from "next/navigation";

import { getCurrentUser } from "@/server/session";
import { getAllProjects } from "@/server/services/project";
import { getRecentEntries, getSevenDaysDistribution, getTimelogLastWeek } from "@/server/services/time-entry";

import { pageProps } from "@/types";
import { getTimeInHours } from "@/lib/helper";

import CategoryDataBar from "@/components/charts/category-bar";
import { TimeEntry } from "@/components/time-entry";
import TimeBarChart from "@/components/charts/time-barchart";

export default async function Dashboard({ params }: pageProps) {
  const user = await getCurrentUser();
  const { team } = params;

  if (!user) {
    return notFound();
  }

  const projects = await getAllProjects(user.id, team);
  const loggedTime = await getTimelogLastWeek(team, user.id);
  const recentTimeEntries = await getRecentEntries(team, user.id);
  const sevenDaysDistribution = await getSevenDaysDistribution(team, user.id);

  const maxHourPerDay = 7.5;

  return (
    <div className="col-span-12 mb-6 grid w-full grid-cols-12 items-start gap-4">
      <main className="col-span-12 flex flex-col gap-4 lg:col-span-9">
        <TimeEntry team={team} projects={projects ? projects : []} recentTimeEntries={recentTimeEntries} />
      </main>
      <aside className="hidden space-y-4 lg:col-span-3 lg:block">
        <CategoryDataBar
          title="Logged hours"
          subtitle="Last 7 days"
          markerValue={getTimeInHours(loggedTime)}
          maxValue={maxHourPerDay * 5}
          type="hours"
        />
        <TimeBarChart sevenDaysDistribution={sevenDaysDistribution} />
      </aside>
    </div>
  );
}
