import { Metadata } from "next";
import { notFound } from "next/navigation";

import { db } from "@/server/db";

import { pageProps } from "@/types";
import TimeChart from "./time-chart";

export const metadata: Metadata = {
  title: `Overview`,
};

export default async function Page({ params }: pageProps) {
  const { team, project } = params;

  if (!project) {
    return notFound();
  }

  // get all last 30 days timeentries for the project group by date
  const timeEntries = await db.timeEntry.groupBy({
    by: ["date"],
    where: {
      workspace: {
        slug: team,
      },
      projectId: +project,
      date: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    _sum: {
      time: true,
    },
  });

  // get all last 30 days timeentries for the project group by date
  const billableTimeEntries = await db.timeEntry.groupBy({
    by: ["date"],
    where: {
      workspace: {
        slug: team,
      },
      projectId: +project,
      date: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      billable: true,
    },
    _sum: {
      time: true,
    },
  });

  const formattedEntries = timeEntries.map((entry) => ({
    date: entry.date,
    time: entry._sum.time ?? 0,
  }));

  const formattedBillableEntries = billableTimeEntries.map((entry) => ({
    date: entry.date,
    time: entry._sum.time ?? 0,
  }));

  return <TimeChart timeEntries={formattedEntries} billableEntries={formattedBillableEntries} />;
}
