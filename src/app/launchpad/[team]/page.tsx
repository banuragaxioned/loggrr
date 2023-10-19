import { notFound } from "next/navigation";
import { getProjectSummary, getAllUserProjects } from "@/server/services/project";
import { Skeleton } from "@/components/ui/skeleton";
import { TimeEntry } from "@/components/time-entry";
import { getCurrentUser } from "@/lib/session";

import {
  Card, 
  Text, 
  Flex, 
  CategoryBar, 
  TabList,
  Tab,
  TabGroup,
  TabPanels,
  TabPanel,
  ProgressBar,
  MarkerBar,
} from "@tremor/react";
import { pageProps } from "@/types";
import { db } from "@/lib/db";

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
        }
      },
      User: {
        select: {
          TimeEntry: {
            select: {
              projectId: true,
              time: true,
            }
          }
        }
      }
    }
  })

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
        }
      },
    }
  })

  const overallEntryTime = userTimeEntry.map((item) => item.time).reduce((sum: number, num: number) => sum + num, 0);

  return (
    <div className="col-span-12 grid w-full grid-cols-12">
      <main className="col-span-12 flex flex-col gap-4 md:col-span-9">
        {/* Horizontal Calendar and date picker */}
        <TimeEntry team={team} projects={projects ? projects : []} userId={user.id} />
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
            {/* Time Insights (breakdown of time based on projects) */}
            <Text className="pb-5 pt-8 text-base font-semibold">Time logged</Text>
            <TabGroup>
              <TabList className="">
                <Tab>Projects</Tab>
                <Tab>Assigned</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  {userTimeEntry.length === 0 ? <p>Log your hours</p> : userTimeEntry.map((item, i) => (
                    <div className="mt-8" key={i}>
                      <Text className="w-full font-semibold text-black leading-5">{item.Project.name}</Text>
                      <Flex className="items-center mt-3">
                        <ProgressBar value={item.time} color="indigo" className="mr-4" />
                        <Text className="text-gray-500 text-sm font-normal">{Math.round(item.time / 40 * 100)}%</Text>
                      </Flex>
                    </div>
                  ))}
                </TabPanel>
                <TabPanel>
                  {userTimeAllocated.map((item, i) => {
                    const entryValue = item.User.TimeEntry.filter((ele) => ele.projectId === item.Project.id).reduce((acc, current) => acc + current.time, 0);

                    return (
                      <div className="mt-8" key={i}>
                        <Text className="w-full font-semibold text-black leading-5">{item.Project.name}</Text>
                        <Flex className="items-center mt-3">
                          <MarkerBar value={item.billableTime + item.nonBillableTime} minValue={0} maxValue={entryValue} color="slate" className="mr-4" />
                          <Text className="text-gray-500 text-sm font-normal">{entryValue}h</Text>
                        </Flex>
                      </div>
                    )
                  })}
                </TabPanel>
              </TabPanels>
            </TabGroup>
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
