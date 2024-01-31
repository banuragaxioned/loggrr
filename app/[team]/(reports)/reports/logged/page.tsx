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
  const selectedBilling = searchParams.billable;
  const selectedProject = searchParams.project;
  const selectedClients = searchParams.clients;
  const selectedPeoples = searchParams.peoples;
  const { startDate, endDate } = getMonthStartAndEndDates(selectedMonth) ?? {};
  const {
    data: loggedData,
    allClients,
    allUsers,
  } = await getLogged(
    params.team,
    startDate,
    endDate,
    selectedBilling,
    selectedProject,
    selectedClients,
    selectedPeoples,
  );

  // Transformed data as per the table structure
  const transformedData = loggedData.map((logged: any) => {
    // Clients
    const clientHoursMap = logged.projects.map((item: any) => item.users.map((user: any) => user.userHours));
    const clientHours = clientHoursMap.flat().reduce((sum: any, item: any) => (sum += item), 0);
    return {
      id: logged.clientId,
      name: logged.clientName,
      hours: clientHours,
      subRows: logged.projects.map((project: any) => {
        // Projects
        const projectHours = project.users.reduce((sum: any, user: any) => (sum += user.userHours), 0);
        return {
          id: project.projectId,
          name: project.projectName,
          hours: projectHours,
          subRows: project.users
            .filter((user: any) => user.userHours > 0)
            .map((user: any) => {
              // Users
              return {
                id: user.userId,
                name: user.userName,
                hours: user.userHours,
                image: user.userImage,
                subRows: user.userTimeEntry.map((time: any) => {
                  // Time Entries
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
      <DashboardHeader heading="Logged Hours" text="View the hours that are logged." />
      <div className="mb-8">
        <DataTable columns={columns} data={transformedData} allClients={allClients} allUsers={allUsers} />
      </div>
    </DashboardShell>
  );
}
