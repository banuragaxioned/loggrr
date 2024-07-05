import { getLoggedTime } from "@/server/services/ai";
import { endOfDay, startOfDay } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getTimeInHours } from "@/lib/helper";

export async function ShowTimeEntries({
  workspace,
  userId,
  startDate,
  endDate,
  billable,
}: {
  workspace: string;
  userId?: number;
  startDate: Date;
  endDate: Date;
  billable?: boolean;
}) {
  const res = await getLoggedTime(workspace, startOfDay(startDate), endOfDay(endDate), userId, billable);
  const total = getTimeInHours(res._sum.time || 0);

  return (
    <div>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>
            {startDate.toDateString()} - {endDate.toDateString()}
          </CardDescription>
          <CardTitle className="text-4xl">{total}</CardTitle>
        </CardHeader>
        <CardFooter>
          <Progress value={(total / 7.5) * 100} />
        </CardFooter>
      </Card>
    </div>
  );
}

// skeleton of the logged time component
export async function ShowTimeEntriesSkeleton({}) {
  return (
    <div>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>xxx - xxx</CardDescription>
          <CardTitle className="text-4xl">xx</CardTitle>
        </CardHeader>
        <CardFooter>
          <Progress value={0} />
        </CardFooter>
      </Card>
    </div>
  );
}
