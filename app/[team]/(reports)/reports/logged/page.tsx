import type { Metadata } from "next";
import { pageProps } from "@/types";

import { getLogged } from "@/server/services/time-entry";
import { getStartandEndDates } from "@/lib/months";
import { DashboardShell } from "@/components/ui/shell";
import { DashboardHeader } from "@/components/ui/header";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getCurrentUser } from "@/server/session";
import { checkAccess, getUserRole } from "@/lib/helper";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: `Logged`,
};

export default async function Page({ params, searchParams }: pageProps) {
  const user = await getCurrentUser();
  const workspaceRole = getUserRole(user?.workspaces, params.team);
  const hasAccess = checkAccess(workspaceRole, [""]);

  if (!user || !hasAccess) {
    return notFound();
  }

  const selectedRange = searchParams.range;
  const selectedBilling = searchParams.billable;
  const selectedProject = searchParams.project;
  const selectedClients = searchParams.clients;
  const selectedMembers = searchParams.members;
  const { startDate, endDate } = getStartandEndDates(selectedRange);
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
    selectedMembers,
  );

  // Transformed data as per the table structure
  const transformedData = loggedData
    // * Filter for clients with logged hours
    .filter((logged: any) => {
      const clientHoursMap = logged.projects.map((item: any) => item.users.map((user: any) => user.userHours));
      const clientHours = clientHoursMap.flat().reduce((sum: any, item: any) => (sum += item), 0);
      return clientHours > 0;
    })
    .map((logged: any) => {
      // Clients
      const clientHoursMap = logged.projects.map((item: any) => item.users.map((user: any) => user.userHours));
      const clientHours = clientHoursMap.flat().reduce((sum: any, item: any) => (sum += item), 0);
      return {
        id: logged.clientId,
        name: logged.clientName,
        hours: +`${clientHours.toFixed(2)}`,
        subRows: logged.projects
          .filter((project: any) => project.users.reduce((sum: any, user: any) => (sum += user.userHours), 0) > 0) // filter out projects if logged hour is zero
          .map((project: any) => {
            // Projects
            const projectHours = project.users.reduce((sum: any, user: any) => (sum += user.userHours), 0);
            return {
              id: project.projectId,
              name: project.projectName,
              hours: +`${projectHours.toFixed(2)}`,
              subRows: project.users
                .filter((user: any) => user.userHours > 0) // filter users by userHours
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
                        billable: time.billable,
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
