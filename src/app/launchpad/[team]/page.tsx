import { notFound } from "next/navigation";
import { getProjectSummary, getAllUserProjects } from "@/server/services/project";
import { Skeleton } from "@/components/ui/skeleton";
import { TimeEntry } from "@/components/time-entry";
import { getCurrentUser } from "@/lib/session";
import { pageProps } from "@/types";
import { Card, Text, Flex, CategoryBar } from "@tremor/react";
import { db } from "@/lib/db";

export default async function Dashboard({ params }: pageProps) {
  const user = await getCurrentUser();
  const { team } = params;

  if (!user) {
    return notFound();
  }

  const projects = await getAllUserProjects(user.id);
  const userTimeEntry = await db.timeEntry.findMany({
    where: {
      userId: user.id,
    },
    select: {
      time: true,
    },
  });

  const overallEntryTime = userTimeEntry.map((item) => item.time).reduce((sum: number, num: number) => sum + num, 0);

  return (
    <div className="col-span-12 grid w-full grid-cols-12">
      <main className="col-span-12 flex flex-col gap-4 md:col-span-9">
        {/* Horizontal Calendar and date picker */}
        <TimeEntry team={team} projects={projects ? projects : []} />
      </main>
      <aside className="col-span-12 m-2 hidden space-y-12 md:col-span-3 lg:block lg:basis-1/4">
        {/* Quick stats (% of time logged in the last week) */}
        <div className="flex flex-col items-center gap-4">
          <Card className="mx-auto w-60 p-4 pb-6">
            <Text className="pb-5 text-base font-semibold">Logged hours</Text>
            <Flex>
              <Text className="pb-4 text-sm">
                <span className="text-3xl font-semibold">{overallEntryTime}</span> / 40h
              </Text>
            </Flex>
            <CategoryBar
              values={[25, 25, 25, 25]}
              colors={["rose", "orange", "yellow", "emerald"]}
              markerValue={(overallEntryTime / 40) * 100}
              className="mt-3 text-sm"
            />
          </Card>
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
