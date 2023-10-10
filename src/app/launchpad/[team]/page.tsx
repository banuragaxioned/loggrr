import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/session";

import { notFound } from "next/navigation";
import { Card, Text, Flex, CategoryBar } from "@tremor/react";
import { db } from "@/lib/db";

export default async function Dashboard() {
  const user = await getCurrentUser();

  const userTimeAllocated = await db.allocation.findMany({
    where: {
      userId: user?.id,
    },
    select: {
      billableTime: true
    }
  })

  const userTimeEntry = await db.timeEntry.findMany({
    where: {
      userId: user?.id
    },
    select: {
      time: true
    }
  })

  // Add all the billable time if user present in more than 1 project
  function sumArray(sum: number, num: number): number {
    return sum + num;
  }

  const overallAllocatedTime = userTimeAllocated.map((item) => item.billableTime).reduce(sumArray);
  const overallEntryTime = userTimeEntry.map((item) => item.time).reduce(sumArray);

  if (!user) {
    return notFound();
  }

  return (
    <div className="col-span-12 grid w-full grid-cols-12">
      <main className="col-span-9 flex flex-col gap-4">
        {/* Horizontal Calendar and date picker */}
        <Skeleton className="h-16 w-full" />
        {/* Time Entry Combobox */}
        <Skeleton className="h-24 w-full" />
        {/* Time Entries */}
        <Skeleton className="h-80 w-full" />
      </main>
      <aside className="col-span-3 m-2 hidden space-y-12 lg:block lg:basis-1/4">
        {/* Quick stats (% of time logged in the last week) */}
        <div className="flex flex-col items-center gap-4">
          <Card className="w-60 mx-auto p-4 pb-6">
            <Text className="pb-5 text-base font-semibold">Logged hours</Text>
            <Flex>
              <Text className="text-sm pb-4"><span className="text-3xl font-semibold">{overallEntryTime}</span> / {overallAllocatedTime}h</Text>
            </Flex>
            <CategoryBar
              values={[25, 25, 25, 25]}
              colors={["rose", "orange", "yellow", "emerald"]}
              markerValue={overallEntryTime / overallAllocatedTime * 100}
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
