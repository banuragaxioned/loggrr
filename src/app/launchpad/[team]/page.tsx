import { notFound } from "next/navigation";
import {getProjectSummary } from "@/server/services/project";
import { Skeleton } from "@/components/ui/skeleton";
import { TimeEntry } from "@/components/time-entry";
import { getCurrentUser } from "@/lib/session";
import { pageProps } from "@/types";

export default async function Dashboard({ params }: pageProps) {
  const user = await getCurrentUser();
  const { team } = params;

  if (!user) {
    return notFound();
  }

  const projects = await getProjectSummary(team,user.id);

  return (
    <div className="col-span-12 grid w-full grid-cols-12">
      <main className="col-span-9 flex flex-col gap-4">
        {/* Horizontal Calendar and date picker */}
        <Skeleton className="h-16 w-full" />
        <TimeEntry team={team} projects={projects}  userId={user.id}/>
      </main>
      <aside className="col-span-3 m-2 hidden space-y-12 lg:block lg:basis-1/4">
        {/* Quick stats (% of time logged in the last week) */}
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-60" />
        </div>
        {/* Time Insights (breakdown of time over the last week) */}
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-60" />
        </div>
        {/* Advanced Analytics (comparision vs. peer average, and vs. self from the previous week) */}
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-60" />
        </div>
        {/* Quick polls and survey */}
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-60" />
        </div>
      </aside>
    </div>
  );
}
