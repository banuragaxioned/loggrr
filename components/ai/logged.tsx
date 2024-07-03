import { getLoggedTime } from "@/server/services/ai";
import { endOfDay, startOfDay } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export async function TimeEntries({ userId, startDate, endDate }: { userId: number; startDate: Date; endDate: Date }) {
  const res = await getLoggedTime("axioned", userId, startOfDay(startDate), endOfDay(endDate));
  console.log(res);

  return (
    <div>
      {/* show sum of time logged, grouped by project */}
      {/* <TimeCard /> */}
      {res.map((entry) => (
        <div key={entry.projectId}>
          {entry.projectId}: {entry._sum.time}
        </div>
      ))}
    </div>
  );
}

export default function TimeCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>This Week</CardDescription>
        <CardTitle className="text-4xl">$1,329</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">+25% from last week</div>
      </CardContent>
      <CardFooter>
        <Progress value={25} aria-label="25% increase" />
      </CardFooter>
    </Card>
  );
}
