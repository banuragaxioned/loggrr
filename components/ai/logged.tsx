import { getLoggedTime } from "@/server/services/ai";
import { endOfDay, startOfDay } from "date-fns";

export async function TimeEntries({ userId, startDate, endDate }: { userId: number; startDate: Date; endDate: Date }) {
  const res = await getLoggedTime("axioned", userId, startOfDay(startDate), endOfDay(endDate));
  console.log(res);

  return (
    <div>
      {/* show sum of time logged, grouped by project */}
      {res.map((entry) => (
        <div key={entry.projectId}>
          {entry.projectId}: {entry._sum.time}
        </div>
      ))}
    </div>
  );
}
