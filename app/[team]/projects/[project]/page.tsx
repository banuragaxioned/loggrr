import { Metadata } from "next";

import {
  getMemberEntriesGroupedByName,
  getMembersNameInTimeEntries,
  getMembersTimeEntries,
  getMilestonesInProject,
  getProjectDetailsById,
  getTasksInProject,
} from "@/server/services/project";

import { pageProps } from "@/types";

import TimeChart from "./components/time-chart";
import UserDetails from "./components/user-details";
import { DataTableToolbar } from "./components/toolbar";
import { getStartandEndDates } from "@/lib/months";
import { differenceInDays, startOfMonth } from "date-fns";

export const metadata: Metadata = {
  title: `Overview`,
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { team, project } = params;
  const projectDetails = await getProjectDetailsById(team, +project!);
  const selectedRange = searchParams.range;
  const selectedBilling = searchParams.billable;
  const selectedMembers = searchParams.members;
  const selectedCategory = searchParams.category;
  const selectedTask = searchParams.task;
  const isFixed = projectDetails?.interval === "FIXED";

  const { startDate, endDate } = selectedRange
    ? getStartandEndDates(selectedRange)
    : isFixed
      ? { startDate: projectDetails?.createdAt ?? startOfMonth(new Date()), endDate: new Date() }
      : getStartandEndDates("");

  const { timeEntries } = await getMembersTimeEntries(
    team,
    +project!,
    startDate,
    endDate,
    selectedBilling,
    selectedMembers,
    selectedCategory,
    selectedTask,
  );
  const { memberEntries } = await getMemberEntriesGroupedByName(
    team,
    +project!,
    startDate,
    endDate,
    selectedBilling,
    selectedMembers,
    selectedCategory,
    selectedTask,
  );
  const [allMembers, allCategories, allTasks] = await Promise.all([
    getMembersNameInTimeEntries(team, +project!),
    getMilestonesInProject(team, +project!),
    getTasksInProject(team, +project!),
  ]);

  const totalDays = differenceInDays(endDate, startDate) + 1;
  const isBillable = projectDetails?.billable ?? false;

  return (
    <>
      <DataTableToolbar
        isBillable={isBillable}
        allMembers={allMembers}
        allCategories={allCategories}
        allTasks={allTasks}
        interval={projectDetails?.interval}
        projectCreatedAt={projectDetails?.createdAt?.toISOString()}
      />
      <TimeChart
        timeEntries={timeEntries}
        totalDays={totalDays}
        startDate={startDate.toISOString()}
        endDate={endDate.toISOString()}
      />
      <UserDetails userData={memberEntries} showTask={!selectedTask} categories={allCategories} tasks={allTasks} />
    </>
  );
}
