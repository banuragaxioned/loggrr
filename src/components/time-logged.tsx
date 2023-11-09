"use client";
import { TimeEntry } from "@/components/time-entry";
import { Text, Flex, CategoryBar, TabList, Tab, TabGroup, TabPanels, TabPanel,ProgressBar } from "@tremor/react";
import { Icons } from "@/components/icons";
import { MarkerBar } from "@/components/marker-bar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Project } from "@/types";
import { useState } from "react";

export interface UserTimeEntry {
  totalTime: number;
  projects:{
    name:string;
    timeEntered:number;
  }[]
}

interface TimeLoggedProps {
  team: string;
  projects: Project[];
  allocationData: {
    projectName: string;
    billable: number;
    nonBillable: number;
    entryValue: number;
  }[];
}

export const TimeLogged = ({ team, projects, allocationData }: TimeLoggedProps) => {
  const [userTimeEntry, setUserEntry] = useState<UserTimeEntry>({ totalTime: 0.0,projects:[] });
  return (
    <>
      <main className="col-span-12 flex flex-col gap-4 md:col-span-9">
        {/* Horizontal Calendar and date picker */}
        <TimeEntry team={team} projects={projects} setUserEntry={setUserEntry} />
      </main>
      <aside className="col-span-12 hidden space-y-12 md:col-span-3 lg:block lg:basis-1/4">
        {/* Quick stats (% of time logged in the last week) */}
        <div className="flex flex-col items-center gap-4">
          <div className="side-bar mx-auto w-full max-w-xs rounded-xl border border-border p-4 pb-6">
            <Flex className="items-center font-semibold">
              <Text className="from-green-to-red bg-gradient-to-r pb-5 text-base">Logged hours</Text>
              <Text className="flex items-center pb-5 text-xs text-[#6B7280]">
                <Icons.calendar className="ml-2 mr-[5px] h-4 w-4" />
                Current week
              </Text>
            </Flex>
            <Flex>
              <Text className="pb-4 text-sm">
                <span className="text-3xl font-semibold">{userTimeEntry.totalTime.toFixed(2)}</span> / 40h
              </Text>
            </Flex>
            <CategoryBar
              values={[25, 25, 25, 25]}
              colors={["rose", "orange", "yellow", "emerald"]}
              markerValue={(userTimeEntry.totalTime / 40) * 100}
              className="mt-3 text-sm "
              tooltip={`${(userTimeEntry.totalTime / 40) * 100}%`}
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
                  <ScrollArea className={`${userTimeEntry.projects.length >= 5 ? "h-[500px]" : "h-auto"} w-full}`}>
                    {userTimeEntry.projects.length === 0 ?
                      <div className="mt-8 pr-3">
                        <Text className="w-full font-semibold text-black leading-5">Projects</Text>
                        <Flex className="items-center mt-3">
                          <ProgressBar value={0} color="indigo" className="mr-4" />
                          <Text className="text-gray-500 text-sm font-normal">0%</Text>
                        </Flex>
                      </div> :
                      userTimeEntry.projects.map((item, i) => (
                        <div className="mt-8 pr-3" key={i}>
                          <Text className="w-full font-semibold text-black leading-5">{item.name}</Text>
                          <Flex className="items-center mt-3">
                            <ProgressBar value={item.timeEntered} color="indigo" className="mr-4" />
                            <Text className="text-gray-500 text-sm font-normal">{Math.round(item.timeEntered / 2400 * 100)}%</Text>
                          </Flex>
                        </div>
                      ))}
                  </ScrollArea>
                </TabPanel>
                <TabPanel className="mt-0 max-h-[550px]">
                  <ScrollArea className={`${allocationData.length >= 5 ? "h-[550px]" : "h-auto"} w-full}`}>
                    {allocationData.map((item, i) => {
                      return (
                        <div className="mt-8 pr-3" key={i}>
                          <Text className="w-full font-semibold leading-5 text-black">{item.projectName}</Text>
                          <Flex className="mt-3 items-center">
                            <MarkerBar
                              value={item.billable + item.nonBillable}
                              minValue={0}
                              maxValue={item.entryValue / 60}
                              color="slate"
                              className="relative mr-4 w-full rounded-md bg-slate-200"
                            />
                            <Text className="text-sm font-normal text-gray-500">{item.entryValue / 60}h</Text>
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
      </aside>
    </>
  );
};
