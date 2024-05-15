import { Metadata } from "next";
import { notFound } from "next/navigation";

import { db } from "@/server/db";

import { DashboardShell } from "@/components/ui/shell";
import { pageProps } from "@/types";
import TimeLoggedCard from "./timelogged-card";
import { TeamsCard } from "./teams-card";
import BillableCard from "./billable-card";
import TimeChart from "./time-chart";

export const metadata: Metadata = {
  title: `Overview`,
};

export default async function Page({ params }: pageProps) {
  const { team, project } = params;

  if (!project) {
    return notFound();
  }

  const timeLogOverall = await db.timeEntry.groupBy({
    by: ["projectId"],
    where: {
      workspace: {
        slug: team,
      },
      projectId: +project,
    },
    _sum: {
      time: true,
    },
  });

  const timeLogLast30 = await db.timeEntry.groupBy({
    by: ["projectId"],
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

  const billable = await db.timeEntry.groupBy({
    by: ["projectId"],
    where: {
      workspace: {
        slug: team,
      },
      projectId: +project,
      billable: true,
    },
    _sum: {
      time: true,
    },
  });

  const timecardProp = {
    overall: timeLogOverall[0]?._sum.time ?? 0,
    last30: timeLogLast30[0]?._sum.time ?? 0,
  };

  const billableCardProp = {
    overall: timeLogOverall[0]?._sum.time ?? 0,
    billable: billable[0]?._sum.time ?? 0,
  };

  const members = await db.project.findUnique({
    where: {
      id: +project,
    },
    select: {
      usersOnProject: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            },
          },
        },
      },
    },
  });

  const allMembers = members?.usersOnProject
    .filter((member) => member.user.name || member.user.image)
    .map((member) => ({
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
      image: member.user.image,
    }));

  // Get last 30 days active users
  const userActivity = await db.timeEntry.groupBy({
    by: ["userId"],
    where: {
      workspace: {
        slug: team,
      },
      projectId: +project,
      date: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
  });

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

  return (
    <DashboardShell>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-9">
          <TimeChart timeEntries={formattedEntries} billableEntries={formattedBillableEntries} />
        </div>
        <div className="col-span-12 flex flex-col gap-4 lg:col-span-3">
          <TeamsCard items={allMembers} activeUserCount={userActivity.length} />
          <TimeLoggedCard timecardProp={timecardProp} />
          <BillableCard timecardProp={billableCardProp} />
        </div>
      </div>
    </DashboardShell>
  );
}
