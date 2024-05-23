import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getMemberEntriesGroupedByName, getMembersTimeEntries } from "@/server/services/project";

import { pageProps } from "@/types";

import TimeChart from "./components/time-chart";

export const metadata: Metadata = {
  title: `Overview`,
};

export default async function Page({ params }: pageProps) {
  const { team, project } = params;

  const { timeEntries, billableEntries } = await getMembersTimeEntries(team, +project!);
  const { memberEntries } = await getMemberEntriesGroupedByName(team, +project!);

  return <TimeChart timeEntries={timeEntries} billableEntries={billableEntries} userData={memberEntries} />;
}
