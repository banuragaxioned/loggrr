import type { Metadata } from "next";
import { pageProps } from "@/types";

import { getLogged } from "@/server/services/time-entry";
import { getMonthStartAndEndDates } from "@/lib/months";
import { DashboardShell } from "@/components/ui/shell";
import { DashboardHeader } from "@/components/ui/header";

import { columns } from "./columns";
import { DataTable } from "./data-table";

export const metadata: Metadata = {
  title: `Logged`,
};

export default async function Page({ params, searchParams }: pageProps) {
  const selectedMonth = searchParams.month;
  const { startDate, endDate } = getMonthStartAndEndDates(selectedMonth) ?? {};
  const loggedData = await getLogged(params.team, startDate, endDate);

  // Transformed data as per the table structure
  const transformedData = loggedData.map((logged: any) => {
    const clientHoursMap = logged.projects.map((item: any) => item.users.map((user: any) => user.userHours));
    const clientHours = clientHoursMap.flat().reduce((sum: any, item: any) => (sum += item), 0);
    return {
      id: logged.clientId,
      name: logged.clientName,
      hours: clientHours,
      subRows: logged.projects.map((project: any) => {
        const projectHours = project.users.reduce((sum: any, user: any) => (sum += user.userHours), 0);
        return {
          id: project.projectId,
          name: project.projectName,
          hours: projectHours,
          subRows: project.users.map((user: any) => {
            return {
              id: user.userId,
              name: user.userName,
              hours: user.userHours,
              image: user.userImage,
              subRows: user.userTimeEntry.map((time: any) => {
                return {
                  id: time.comments,
                  hours: time.time,
                  name: time.formattedDate,
                  description: time.comments,
                };
              }),
            };
          }),
        };
      }),
    };
  });

  return (
    <DashboardShell>
      <DashboardHeader heading="Logged Hours" text="View all the hours that is logged" />
      <div className="mb-8">
        <DataTable columns={columns} data={transformedData} />
      </div>
    </DashboardShell>
  );
}
