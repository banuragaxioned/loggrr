import { Hourglass, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DashboardShell } from "@/components/ui/shell";
import { db } from "@/server/db";
import { getTimeInHours } from "@/lib/helper";
import { pageProps } from "@/types";
import { teamMemberStats as getTeamMemberStats } from "@/server/services/project";

export default async function Page({ params }: pageProps) {
  const { team, project } = params;

  if (!project) {
    return null;
  }

  const projectDetails = await db.project.findUnique({
    where: {
      id: +project,
      workspace: {
        slug: team,
      },
    },
  });

  if (!projectDetails) {
    return null;
  }

  const timeLogSummary = await db.timeEntry.groupBy({
    by: ["milestoneId"],
    where: {
      workspace: {
        slug: team,
      },
      projectId: +project,
      date: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    },
    _sum: {
      time: true,
    },
    _count: {
      time: true,
    },
    _avg: { time: true },
  });

  // flatten the result
  const timeLogSummaryFlat = timeLogSummary.map((item) => {
    return {
      id: item.milestoneId,
      time: item._sum.time,
      count: item._count.time,
      avg: item._avg.time,
    };
  });

  const teamMemberStats = await getTeamMemberStats(team, project);

  const percentageChange = (current: number, previous: number) => {
    // return + and - sign with percentage change as string
    if (current === 0 || previous === 0) return "0%";
    const percentage = ((current - previous) / previous) * 100;
    return percentage > 0 ? `+${percentage.toFixed(2)}%` : `${percentage.toFixed(2)}%`;
  };

  return (
    <DashboardShell>
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total time spent</CardTitle>
            <Hourglass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTimeInHours(timeLogSummaryFlat[0]?.time ?? 0)}h</div>
            <p className="text-xs text-muted-foreground">out of {projectDetails.budget} budgeted hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active contributors in 30 days</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMemberStats[0].length}</div>
            <p className="text-xs text-muted-foreground">
              {percentageChange(teamMemberStats[0].length, teamMemberStats[1].length)} from last month
            </p>
          </CardContent>
        </Card>
      </div> */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-9 grid h-[400px] place-items-center border">Chart area</div>
        <div className="col-span-3 border">2</div>
      </div>
    </DashboardShell>
  );
}
