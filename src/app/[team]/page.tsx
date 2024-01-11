import { notFound } from "next/navigation";
import { getAllUserProjects } from "@/server/services/project";
import { TimeEntry } from "@/components/time-entry";
import { getCurrentUser } from "@/lib/session";
import { pageProps } from "@/types";
import { db } from "@/db";
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
      Workspace: {
        slug: team,
      },
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
      date: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
      Workspace: {
        slug: team,
      },
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
      <main className="col-span-12 flex flex-col gap-4 p-1 lg:col-span-9">
        <TimeEntry team={team} projects={projects ? projects : []} />
      </main>
      <aside className="hidden basis-1/4 space-y-4 lg:col-span-3 lg:block">
        <CategoryDataBar
          title="Logged hours"
          subtitle="Last 7 days"
          markerValue={getTimeInHours(overallEntryTime)}
          maxValue={37.5}
          type="hours"
        />
        {/* TODO: Need to refactor and make the below card reusable like CategoryDataBar */}
        <Card className="border border-border">
          <Flex className="items-center font-semibold">
            <Text className="pb-2">Time assigned</Text>
          </Flex>
          <ScrollArea className={`${userTimeAllocated.length >= 5 ? "h-[550px]" : "h-auto"} w-full}`}>
            {userTimeAllocated.map((item, i) => {
              const entryValue = item.User.TimeEntry.filter((entry) => entry.projectId === item.Project.id).reduce(
                (acc, current) => acc + current.time,
                0,
              );
              return (
                <div className="mt-3 pr-3" key={i}>
                  <Text className="w-full font-semibold leading-5">{item.Project.name}</Text>
                  <Flex className="mt-3 items-center">
                    <MarkerBar
                      value={item.billableTime + item.nonBillableTime}
                      minValue={0}
                      maxValue={entryValue}
                      color="slate"
                      className="relative mr-4 w-full rounded-md "
                    />
                    <Text className="text-sm font-normal">{entryValue}h</Text>
                  </Flex>
                </div>
              );
            })}
          </ScrollArea>
        </Card>
      </aside>
    </div>
  );
}
