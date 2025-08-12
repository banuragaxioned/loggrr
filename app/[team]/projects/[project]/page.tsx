import { Metadata } from "next";

import {
  getMemberEntriesGroupedByName,
  getMembersNameInTimeEntries,
  getMembersTimeEntries,
  getProjectDetailsById,
} from "@/server/services/project";

import { pageProps } from "@/types";

import TimeChart from "./components/time-chart";
import UserDetails from "./components/user-details";
import { DataTableToolbar } from "./components/toolbar";
import { getStartandEndDates } from "@/lib/months";
import { differenceInDays } from "date-fns";

export const metadata: Metadata = {
  title: `Overview`,
};

export default async function Page({ params, searchParams }: pageProps) {
  const { team, project } = params;
  const projectDetails = await getProjectDetailsById(team, +project!);
  const selectedRange = searchParams.range;
  const selectedBilling = searchParams.billable;
  const selectedMembers = searchParams.members;
  const { startDate, endDate } = getStartandEndDates(selectedRange, 30);

  const { timeEntries } = await getMembersTimeEntries(
    team,
    +project!,
    startDate,
    endDate,
    selectedBilling,
    selectedMembers,
  );
  const { memberEntries } = await getMemberEntriesGroupedByName(
    team,
    +project!,
    startDate,
    endDate,
    selectedBilling,
    selectedMembers,
  );
  const allMembers = await getMembersNameInTimeEntries(team, +project!);

  const totalDays = differenceInDays(endDate, startDate) + 1;
  const isBillable = projectDetails?.billable ?? false;

  return (
    <>
      <DataTableToolbar isBillable={isBillable} allMembers={allMembers} />
      <TimeChart timeEntries={timeEntries} totalDays={totalDays} />
      <UserDetails userData={memberEntries} team={team} />
    </>
  );
}
