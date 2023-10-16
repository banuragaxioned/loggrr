import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/session";

import { notFound } from "next/navigation";
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
import { db } from "@/lib/db";

export default async function Dashboard() {
  const user = await getCurrentUser();

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
          name: true
        }
      }
    }
  })

  const userTimeEntry = await db.timeEntry.findMany({
    where: {
      userId: user.id
    },
    select: {
      time: true,
      Project: {
        select: {
          id: true,
          name: true,
        }
      }
    }
  })

  const overallEntryTime = userTimeEntry.map((item) => item.time).reduce((sum: number, num: number) => sum + num, 0);



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
      <aside className="col-span-3 m-2 hidden space-y-12 lg:block lg:basis-2/5">

        <div className="flex flex-col items-center gap-4">
          <Card className="w-60 mx-auto p-4 pb-6">
            <Text className="pb-5 text-base font-semibold">Logged hours</Text>
            <Flex>
              <Text className="text-sm pb-4"><span className="text-3xl font-semibold">{overallEntryTime}</span> / 40h</Text>
            </Flex>
            <CategoryBar
              values={[25, 25, 25, 25]}
              colors={["rose", "orange", "yellow", "emerald"]}
              markerValue={overallEntryTime / 40 * 100}
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
                  {userTimeEntry.map((item, i) => (
                    <div className="mt-8" key={i}>
                      <Text className="w-full font-semibold text-black leading-5">{item.Project.name}</Text>
                      <Flex className="items-center mt-3">
                        <ProgressBar value={45} color="indigo" className="mr-4" />
                        <Text className="text-gray-500 text-sm font-normal">{item.time}%</Text>
                      </Flex>
                    </div>
                  ))}
                </TabPanel>
                <TabPanel>
                  <div className="mt-8">
                  <Text className="w-full font-semibold text-black leading-5">Project</Text>
                    <Flex className="items-center mt-3">
                      <MarkerBar value={45} minValue={0} maxValue={65} color="slate" className="mr-4" />
                      <Text className="text-gray-500 text-sm font-normal">10%</Text>
                    </Flex>
                  </div>
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
