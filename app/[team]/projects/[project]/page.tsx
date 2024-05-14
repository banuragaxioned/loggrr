import { notFound } from "next/navigation";

import { db } from "@/server/db";

import { DashboardShell } from "@/components/ui/shell";
import { pageProps } from "@/types";
import TimeLoggedCard from "./time-logged";

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

  const timecardProp = {
    overall: timeLogOverall[0]?._sum.time ?? 0,
    last30: timeLogLast30[0]?._sum.time ?? 0,
  };

  return (
    <DashboardShell>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-9 grid h-[400px] place-items-center border">Chart area</div>
        <div className="col-span-3">
          <TimeLoggedCard timecardProp={timecardProp} />
        </div>
      </div>
    </DashboardShell>
  );
}
