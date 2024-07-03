import { getLoggedTime } from "@/server/services/ai";
import { endOfDay, startOfDay } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export async function TimeEntries({ userId, startDate, endDate }: { userId: number; startDate: Date; endDate: Date }) {
  const res = await getLoggedTime("axioned", userId, startOfDay(startDate), endOfDay(endDate));
  console.log(res);

  // loop through the response and sum/total the time logged for each project
  const total = res.reduce((acc, entry) => acc + (entry._sum?.time ?? 0), 0);

  return (
    <div>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>
            {startDate.toDateString()} - {endDate.toDateString()}
          </CardDescription>
          <CardTitle className="text-4xl">{total / 60}</CardTitle>
        </CardHeader>
        <CardFooter>
          <Progress value={(total / 60 / 7.5) * 100} />
        </CardFooter>
      </Card>
    </div>
  );
}
