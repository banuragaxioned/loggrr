import { notFound } from "next/navigation";
import { format, subDays } from "date-fns";

import { getCurrentUser } from "@/server/session";
import { getAllProjects } from "@/server/services/project";
import { getTimelogLastWeek } from "@/server/services/time-entry";

import { pageProps } from "@/types";
import { getTimeInHours } from "@/lib/helper";

import CategoryDataBar from "@/components/charts/category-bar";
import { TimeEntry } from "@/components/time-entry";
import { db } from "@/server/db";

export default async function Dashboard({ params }: pageProps) {
  const user = await getCurrentUser();
  const { team } = params;

  if (!user) {
    return notFound();
  }

  const projects = await getAllProjects(user.id, team);
  const loggedTime = await getTimelogLastWeek(team, user.id);

  const today = new Date();
  const sevenDaysAgo = subDays(today, 8);

  const recentTimeEntries = await db.timeEntry.findMany({
    distinct: ["projectId"],
    where: {
      workspace: {
        slug: team,
      },
      date: {
        gte: sevenDaysAgo,
      },
      userId: user.id,
    },
    select: {
      id: true,
      project: true,
      milestone: true,
      task: true,
      billable: true,
      time: true,
      comments: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  return (
    <div className="col-span-12 mb-6 grid w-full grid-cols-12 items-start gap-4">
      <main className="col-span-12 flex flex-col gap-4 lg:col-span-9">
        <TimeEntry team={team} projects={projects ? projects : []} recentTimeEntries={recentTimeEntries} />
      </main>
      <aside className="sticky top-[74px] hidden basis-1/4 space-y-4 lg:col-span-3 lg:block">
        <CategoryDataBar
          title="Logged hours"
          subtitle="Last 7 days"
          markerValue={getTimeInHours(loggedTime)}
          maxValue={37.5}
          type="hours"
        />
      </aside>
    </div>
  );
}
