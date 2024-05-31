import { Metadata } from "next";

import { getMemberEntriesGroupedByName, getMembersTimeEntries } from "@/server/services/project";

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
  const selectedRange = searchParams.range;
  const selectedBilling = searchParams.billable;
  const { startDate, endDate } = getStartandEndDates(selectedRange);

  const { timeEntries, billableEntries } = await getMembersTimeEntries(
    team,
    +project!,
    startDate,
    endDate,
    selectedBilling,
  );
  const { memberEntries } = await getMemberEntriesGroupedByName(team, +project!, startDate, endDate, selectedBilling);
  const totalDays = differenceInDays(endDate, startDate) + 1;

  return (
    <>
      <DataTableToolbar />
      <TimeChart timeEntries={timeEntries} billableEntries={billableEntries} totalDays={totalDays} />
      <UserDetails userData={memberEntries} />
    </>
  );
}
