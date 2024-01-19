import { notFound } from "next/navigation";

import { getCurrentUser } from "@/server/session";
import { getAllProjects } from "@/server/services/project";
import { getTimelogLastWeek } from "@/server/services/time-entry";

import { pageProps } from "@/types";

import { getTimeInHours } from "@/lib/helper";
import CategoryDataBar from "@/components/charts/category-bar";
import { TimeEntry } from "@/components/time-entry";

export default async function Dashboard({ params }: pageProps) {
  const user = await getCurrentUser();
  const { team } = params;

  console.log(params);

  if (!user) {
    return notFound();
  }

  const projects = await getAllProjects(user.id);
  const loggedTime = await getTimelogLastWeek(team, user.id);
  const loggedTimeTotal = loggedTime.map((entry) => entry.time).reduce((sum: number, num: number) => sum + num, 0);

  return (
    <div className="col-span-12 grid w-full grid-cols-12 gap-4">
      <main className="col-span-12 flex flex-col gap-4 p-1 lg:col-span-9">
        <TimeEntry team={team} projects={projects ? projects : []} />
      </main>
      <aside className="hidden basis-1/4 space-y-4 lg:col-span-3 lg:block">
        <CategoryDataBar
          title="Logged hours"
          subtitle="Last 7 days"
          markerValue={getTimeInHours(loggedTimeTotal)}
          maxValue={37.5}
          type="hours"
        />
      </aside>
    </div>
  );
}
