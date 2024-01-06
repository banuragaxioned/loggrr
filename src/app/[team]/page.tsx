import { notFound } from "next/navigation";
import { getAllUserProjects } from "@/server/services/project";
import { getCurrentUser } from "@/lib/session";
import { pageProps } from "@/types";
import { db } from "@/lib/db";
import { Text, Flex, Card } from "@tremor/react";
import { MarkerBar } from "@/components/marker-bar";
import { ScrollArea } from "@/components/ui/scroll-area";
import CategoryDataBar from "@/components/charts/category-bar";
import { getTimeInHours } from "@/lib/helper";

export default async function Dashboard({ params }: pageProps) {
  const user = await getCurrentUser();
  const { team } = params;

  if (!user) {
    return notFound();
  }

  const userTimeAllocated = await db.allocation.findMany({
    where: {
      userId: user.id,
    },
    select: {
      billableTime: true,
      nonBillableTime: true,
      Project: {
        select: {
          id: true,
          name: true,
        },
      },
      User: {
        select: {
          TimeEntry: {
            select: {
              projectId: true,
              time: true,
            },
          },
        },
      },
    },
  });
  const projects = await getAllUserProjects(user.id);

  const userTimeEntry = await db.timeEntry.findMany({
    where: {
      userId: user.id,
    },
    select: {
      time: true,
      Project: {
        select: {
          name: true,
        },
      },
    },
  });

  const overallEntryTime = userTimeEntry.map((item) => item.time).reduce((sum: number, num: number) => sum + num, 0);

  return (
    <div className="col-span-12 grid w-full grid-cols-12 gap-4">
      <main className="col-span-12 flex flex-col gap-4 lg:col-span-9"></main>
      <aside className="hidden basis-1/4 space-y-4 lg:col-span-3 lg:block">
        <CategoryDataBar
          title="Logged hours"
          subtitle="Last 7 days"
          markerValue={getTimeInHours(overallEntryTime)}
          maxValue={37.5}
          type="hours"
        />
      </aside>
    </div>
  );
}
