import type { Metadata } from "next";
import { pageProps } from "@/types";

import { Logged, columns } from "./columns";
import { DataTable } from "./data-table";
import { DashboardShell } from "@/components/ui/shell";
import { DashboardHeader } from "@/components/ui/header";
import { getLogged } from "@/server/services/time-entry";

export const metadata: Metadata = {
  title: `Logged`,
};

export default async function Page({ params }: pageProps) {
  const loggedData = await getLogged(params.team);

  const transformedData = loggedData.map((logged: any) => {
    return {
      id: logged.clientId,
      name: logged.clientName,
      subRows: logged.projects.map((project: any) => {
        const projectHours = project.users.reduce((sum: any, item: any) => (sum += item.hours), 0);
        console.log(projectHours);

        return {
          id: project.projectId,
          name: project.projectName,
          hours: projectHours,
          subRows: project.users.map((user: any) => {
            const userHours = user.userTimeEntry.reduce((sum: any, item: any) => (sum += item.time), 0);

            return {
              id: user.userId,
              name: user.userName,
              hours: userHours,
              subRows: user.userTimeEntry.map((time: any) => {
                const inputDate = new Date(time.date);
                const formattedDate = inputDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                });

                return {
                  id: time.comments,
                  hours: time.time,
                  name: formattedDate,
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
