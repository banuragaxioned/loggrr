import { notFound } from "next/navigation";
import { getAllUserProjects } from "@/server/services/project";
import { TimeEntry } from "@/components/time-entry";
import { getCurrentUser } from "@/lib/session";
import { pageProps } from "@/types";
import { db } from "@/lib/db";
import { Text, Flex, CategoryBar, TabList, Tab, TabGroup, TabPanels, TabPanel, ProgressBar } from "@tremor/react";
import { CalendarDays, Camera } from "lucide-react";
import { MarkerBar } from "@/components/marker-bar";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <div className="container col-span-12 grid w-full grid-cols-12">
      <main className="col-span-12 flex flex-col gap-4 md:col-span-9">
        {/* Horizontal Calendar and date picker */}
        <TimeEntry team={team} projects={projects ? projects : []} />
      </main>
      <aside className="col-span-12 hidden space-y-12 md:col-span-3 lg:block lg:basis-1/4">
        {/* Quick stats (% of time logged in the last week) */}
        <div className="flex flex-col items-center gap-4">
          <div className="side-bar mx-auto w-full max-w-xs rounded-xl border border-border p-4 pb-6">
            <Flex className="items-center font-semibold">
              <Text className="from-green-to-red bg-gradient-to-r pb-5 text-base">Logged hours</Text>
              <Text className="flex items-center pb-5 text-xs text-[#6B7280]">
                <CalendarDays className="ml-2 mr-[5px] h-4 w-4" />
                Current week
              </Text>
            </Flex>
            <Flex>
              <Text className="pb-4 text-sm">
                <span className="text-3xl font-semibold">{(overallEntryTime / 60).toFixed(2)}</span> / 40h
              </Text>
            </Flex>
            <CategoryBar
              values={[25, 25, 25, 25]}
              colors={["rose", "orange", "yellow", "emerald"]}
              markerValue={(overallEntryTime / 40) * 100}
              className="mt-3 text-sm "
              tooltip={`${Math.round((overallEntryTime / 40) * 100)}%`}
            />
            {/* Time Insights (breakdown of time based on projects) */}
            <Text className="pb-5 pt-8 text-base font-semibold">Time logged</Text>
            <TabGroup>
              <TabList className="">
                <Tab>Projects</Tab>
                <Tab>Assigned</Tab>
              </TabList>
              <TabPanels>
                <TabPanel className="mt-0 max-h-[500px]">
                  <ScrollArea className={`${userTimeEntry.length >= 5 ? "h-[500px]" : "h-auto"} w-full}`}>
                    {userTimeEntry.length === 0 ? (
                      <div className="mt-8 pr-3">
                        <Text className="w-full font-semibold leading-5 text-black">Projects</Text>
                        <Flex className="mt-3 items-center">
                          <ProgressBar value={0} color="indigo" className="mr-4" />
                          <Text className="text-sm font-normal text-gray-500">0%</Text>
                        </Flex>
                      </div>
                    ) : (
                      userTimeEntry.map((item, i) => (
                        <div className="mt-8 pr-3" key={i}>
                          <Text className="w-full font-semibold leading-5 text-black">{item.Project.name}</Text>
                          <Flex className="mt-3 items-center">
                            <ProgressBar value={item.time} color="indigo" className="mr-4" />
                            <Text className="text-sm font-normal text-gray-500">
                              {Math.round((item.time / 40) * 100)}%
                            </Text>
                          </Flex>
                        </div>
                      ))
                    )}
                  </ScrollArea>
                </TabPanel>
                <TabPanel className="mt-0 max-h-[550px]">
                  <ScrollArea className={`${userTimeAllocated.length >= 5 ? "h-[550px]" : "h-auto"} w-full}`}>
                    {userTimeAllocated.map((item, i) => {
                      const entryValue = item.User.TimeEntry.filter((ele) => ele.projectId === item.Project.id).reduce(
                        (acc, current) => acc + current.time,
                        0,
                      );
                      return (
                        <div className="mt-8 pr-3" key={i}>
                          <Text className="w-full font-semibold leading-5 text-black">{item.Project.name}</Text>
                          <Flex className="mt-3 items-center">
                            <MarkerBar
                              value={item.billableTime + item.nonBillableTime}
                              minValue={0}
                              maxValue={entryValue}
                              color="slate"
                              className="relative mr-4 w-full rounded-md bg-slate-200"
                            />
                            <Text className="text-sm font-normal text-gray-500">{entryValue}h</Text>
                          </Flex>
                        </div>
                      );
                    })}
                  </ScrollArea>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
        </div>
        {/* Time Insights (breakdown of time over the last week)
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-60" />
        </div> */}
      </aside>
    </div>
  );
}
