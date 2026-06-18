import type { Metadata } from "next";
import { pageProps } from "@/types";

import { getLogged } from "@/server/services/time-entry";
import { getStartandEndDates } from "@/lib/months";
import { DashboardShell } from "@/components/ui/shell";
import { DashboardHeader } from "@/components/ui/shell";

import { columns, type Logged } from "./columns";
import { DataTable } from "./data-table";
import { getCurrentUser } from "@/server/session";
import { checkAccess, getUserRole } from "@/lib/helper";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: `Logged`,
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const user = await getCurrentUser();
  const workspaceRole = getUserRole(user?.workspaces, params.team);
  const denyAccess = [""];
  const denyFilters = ["GUEST"];
  const hasAccess = checkAccess(workspaceRole, denyAccess);
  const hasFullAccess = checkAccess(workspaceRole, denyFilters);

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
    hasFullAccess,
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
        type: "client",
        id: logged.clientId,
        name: logged.clientName,
        hours: +`${clientHours.toFixed(2)}`,
        subRows: logged.projects
          .filter((project: any) => project.users.reduce((sum: any, user: any) => (sum += user.userHours), 0) > 0) // filter out projects if logged hour is zero
          .map((project: any) => {
            // Projects
            const projectHours = project.users.reduce((sum: any, user: any) => (sum += user.userHours), 0);

            // Group the project's entries by category (milestone), then by member.
            const categoryMap = new Map<string, any>();
            project.users.forEach((user: any) => {
              user.userTimeEntry.forEach((time: any) => {
                const key = time.milestoneId != null ? `m-${time.milestoneId}` : "none";
                let category = categoryMap.get(key);
                if (!category) {
                  category = {
                    id: time.milestoneId ?? -1,
                    name: time.milestone ?? "No category",
                    hours: 0,
                    members: new Map<number, any>(),
                  };
                  categoryMap.set(key, category);
                }
                category.hours += time.time;

                let member = category.members.get(user.userId);
                if (!member) {
                  member = { type: "member", id: user.userId, name: user.userName, image: user.userImage, hours: 0, subRows: [] };
                  category.members.set(user.userId, member);
                }
                member.hours += time.time;
                member.subRows.push({
                  type: "entry",
                  id: `${user.userId}-${time.date}-${member.subRows.length}`,
                  hours: time.time,
                  name: time.formattedDate,
                  description: time.comments,
                  billable: time.billable,
                  task: time.task ?? null,
                });
              });
            });

            const buildMembers = (members: Map<number, any>) =>
              Array.from(members.values()).map((member: any) => ({ ...member, hours: +`${member.hours.toFixed(2)}` }));

            // Only break entries down by category when the project actually has a
            // real category; otherwise show members directly (no lone "No category").
            const hasRealCategory = Array.from(categoryMap.keys()).some((key) => key !== "none");

            const projectSubRows = hasRealCategory
              ? Array.from(categoryMap.values()).map((category: any) => ({
                  type: "category",
                  id: category.id,
                  name: category.name,
                  hours: +`${category.hours.toFixed(2)}`,
                  subRows: buildMembers(category.members),
                }))
              : buildMembers(categoryMap.get("none")?.members ?? new Map());

            return {
              type: "project",
              id: project.projectId,
              name: project.projectName,
              hours: +`${projectHours.toFixed(2)}`,
              subRows: projectSubRows,
            };
          }),
      };
    });

  return (
    <DashboardShell>
      <DashboardHeader heading="Logged Hours" text="View the hours that are logged." />
      <div className="mb-8">
        <DataTable
          columns={columns}
          data={transformedData as Logged[]}
          allClients={allClients}
          allUsers={allUsers}
          hasFullAccess={hasFullAccess}
        />
      </div>
    </DashboardShell>
  );
}
