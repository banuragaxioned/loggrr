"use client";
import { TimeEntry } from "@/components/time-entry";
import {
    Text,
    Flex,
    CategoryBar,
    TabList,
    Tab,
    TabGroup,
    TabPanels,
    TabPanel,
    ProgressBar,
  } from "@tremor/react";
  import { Icons } from "@/components/icons";
  import { MarkerBar } from "@/components/marker-bar";
  import { ScrollArea } from "@/components/ui/scroll-area";
  import { TimeEntryProps } from "@/components/time-entry";
import { useState } from "react";
  
  interface TimeLoggedProps extends TimeEntryProps{
    allocationData:{
      projectName:string,
      billable:number;
      nonBillable:number,
      entryValue:number
    }[]
  }

export const TimeLogged = ({team,projects,allocationData}:TimeLoggedProps)=> {
  const [userTimeEntry,setUserEntry] = useState<any>({totalTime:0.0});
    return (
        <>
        <main className="col-span-12 flex flex-col gap-4 md:col-span-9">
        {/* Horizontal Calendar and date picker */}
        <TimeEntry team={team} projects={projects} setUserEntry={setUserEntry}/>
      </main>
      <aside className="col-span-12 hidden space-y-12 md:col-span-3 lg:block lg:basis-1/4">
        {/* Quick stats (% of time logged in the last week) */}
        <div className="flex flex-col items-center gap-4">
          <div className="mx-auto max-w-xs w-full border border-border rounded-xl p-4 pb-6 side-bar">
            <Flex className="font-semibold items-center">
              <Text className="pb-5 text-base bg-gradient-to-r from-green-to-red">Logged hours</Text>
              <Text className="text-[#6B7280] text-xs flex items-center pb-5">
                <Icons.calendar className="ml-2 h-4 w-4 mr-[5px]" />
                Current week
              </Text>
            </Flex>
            <Flex>
              <Text className="pb-4 text-sm">
                <span className="text-3xl font-semibold">{userTimeEntry.totalTime}</span> / 40h
              </Text>
            </Flex>
            <CategoryBar
              values={[25, 25, 25, 25]}
              colors={["rose", "orange", "yellow", "emerald"]}
              markerValue={(userTimeEntry.totalTime/40)*100}
              className="mt-3 text-sm "
              tooltip={`${Math.round(userTimeEntry.totalTime/40)*100}%`}
            />
            {/* Time Insights (breakdown of time based on projects) */}
            <Text className="pb-5 pt-8 text-base font-semibold">Time logged</Text>
            <TabGroup>
              <TabList className="">
                <Tab>Projects</Tab>
                <Tab>Assigned</Tab>
              </TabList>
              <TabPanels>
                <TabPanel className="max-h-[500px] mt-0">
                  <ScrollArea className={`${userTimeEntry.length >= 5 ? "h-[500px]" : "h-auto"} w-full}`}>
                    {/* {userTimeEntry.length === 0 ?
                      <div className="mt-8 pr-3">
                        <Text className="w-full font-semibold text-black leading-5">Projects</Text>
                        <Flex className="items-center mt-3">
                          <ProgressBar value={0} color="indigo" className="mr-4" />
                          <Text className="text-gray-500 text-sm font-normal">0%</Text>
                        </Flex>
                      </div> :
                      userTimeEntry.map((item, i) => (
                        <div className="mt-8 pr-3" key={i}>
                          <Text className="w-full font-semibold text-black leading-5">{item.Project.name}</Text>
                          <Flex className="items-center mt-3">
                            <ProgressBar value={item.time} color="indigo" className="mr-4" />
                            <Text className="text-gray-500 text-sm font-normal">{Math.round(item.time / 2400 * 100)}%</Text>
                          </Flex>
                        </div>
                      ))} */}
                  </ScrollArea>
                </TabPanel>
                <TabPanel className="max-h-[550px] mt-0">
                  <ScrollArea className={`${allocationData.length >= 5 ? "h-[550px]" : "h-auto"} w-full}`}>
                    {allocationData.map((item, i) => {
                      return (
                        <div className="mt-8 pr-3" key={i}>
                          <Text className="w-full font-semibold text-black leading-5">{item.projectName}</Text>
                          <Flex className="items-center mt-3">
                            <MarkerBar value={item.billable + item.nonBillable} minValue={0} maxValue={item.entryValue/60} color="slate" className="mr-4 relative w-full bg-slate-200 rounded-md" />
                            <Text className="text-gray-500 text-sm font-normal">{item.entryValue/60}h</Text>
                          </Flex>
                        </div>
                      )
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
    </>
    )
}