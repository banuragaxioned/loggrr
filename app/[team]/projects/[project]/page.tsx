import { Metadata } from "next";
import { notFound } from "next/navigation";

import { db } from "@/server/db";

import { pageProps } from "@/types";
import TimeChart from "./components/time-chart";

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

  const userEntries = await db.timeEntry.findMany({
    where: {
      workspace: {
        slug: team,
      },
      projectId: +project,
      date: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    select: {
      date: true,
      time: true,
      userId: true,
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      comments: true,
      task: {
        select: {
          name: true,
        },
      },
      milestone: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  // Group the time entries by user
  const groupedByUsers = userEntries.reduce((acc: any, entry: any) => {
    const userId = `${entry.userId}`;
    if (!acc[userId]) {
      acc[userId] = {
        user: entry.user,
        entries: [],
      };
    }

    acc[userId].entries.push({
      date: entry.date,
      time: entry.time,
      comments: entry.comments,
      task: entry.task,
      milestone: entry.milestone,
    });

    return acc;
  }, {});

  // Convert the grouped result to an array sorted by user name
  const result = Object.values(groupedByUsers).sort((a: any, b: any) => a.user.name.localeCompare(b.user.name));

  return <TimeChart timeEntries={formattedEntries} billableEntries={formattedBillableEntries} userData={result} />;
}
