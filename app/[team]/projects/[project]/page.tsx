import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { db } from "@/server/db";
import { getTimeInHours } from "@/lib/helper";
import { pageProps } from "@/types";

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

  const teamMemberStats = await db.$transaction([
    db.timeEntry.groupBy({
      by: ["userId"],
      where: {
        workspace: {
          slug: team,
        },
        projectId: +project,
        // get current 30 days
        date: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      },
      orderBy: {
        _count: {
          userId: "asc",
        },
      },
    }),
    db.timeEntry.groupBy({
      by: ["userId"],
      where: {
        workspace: {
          slug: team,
        },
        projectId: +project,
        // get last 30 days
        date: {
          gte: new Date(new Date().setDate(new Date().getDate() - 60)),
          lte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      },
      orderBy: {
        _count: {
          userId: "asc",
        },
      },
    }),
  ]);
  
  const percentageChange = (current: number, previous: number) => {
    // return + and - sign with percentage change as string
    if(current === 0 || previous === 0) return '0%';
    const percentage = ((current - previous) / previous) * 100;
    return percentage > 0 ? `+${percentage.toFixed(2)}%` : `${percentage.toFixed(2)}%`;
  }

  return (
    <DashboardShell>
      <DashboardHeader heading={projectDetails.name} text="This is your project details page.">
        <Button variant="outline">Edit</Button>
      </DashboardHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total time spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTimeInHours(timeLogSummaryFlat[0]?.time ?? 0)}h</div>
            <p className="text-xs text-muted-foreground">out of {projectDetails.budget} budgeted hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active members in last month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMemberStats[0].length}</div>
            <p className="text-xs text-muted-foreground">{percentageChange(teamMemberStats[0].length, teamMemberStats[1].length)} from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 since last hour</p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
