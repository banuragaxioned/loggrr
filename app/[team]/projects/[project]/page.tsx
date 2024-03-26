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
  const timeLogSummaryFlat = timeLogSummary.map((item: any) => {
    return {
      id: item.milestoneId,
      time: item._sum.time,
      count: item._count.time,
      avg: item._avg.time,
    };
  });

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
            <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
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
