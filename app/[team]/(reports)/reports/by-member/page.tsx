import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { pageProps } from "@/types";
import { getLogged } from "@/server/services/time-entry";
import { getStartandEndDates } from "@/lib/months";
import { getCurrentUser } from "@/server/session";
import { checkAccess, getUserRole } from "@/lib/helper";
import { DashboardShell, DashboardHeader } from "@/components/ui/shell";

import { columns, type Logged } from "../logged/columns";
import { DataTable } from "../logged/data-table";

export const metadata: Metadata = {
  title: `By Member`,
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const user = await getCurrentUser();
  const workspaceRole = getUserRole(user?.workspaces, params.team);
  const hasAccess = checkAccess(workspaceRole, [""]);
  const hasFullAccess = checkAccess(workspaceRole, ["GUEST"]);

  if (!user || !hasAccess) {
    return notFound();
  }

  const { startDate, endDate } = getStartandEndDates(searchParams.range);
  const {
    data: loggedData,
    allClients,
    allUsers,
  } = await getLogged(
    params.team,
    startDate,
    endDate,
    searchParams.billable,
    searchParams.project,
    searchParams.clients,
    searchParams.members,
    hasFullAccess,
  );

  // Re-pivot the client→project→user data into a person-first table:
  // each member → total hours, expandable to their per-project hours.
  const byMember = new Map<number, Logged>();
  for (const client of loggedData) {
    for (const project of client.projects) {
      for (const member of project.users) {
        if (!member.userHours) continue;
        const entry =
          byMember.get(member.userId) ??
          ({ id: member.userId, name: member.userName ?? "Unknown", image: member.userImage ?? undefined, hours: 0, subRows: [] } as Logged);
        entry.hours = +`${((entry.hours ?? 0) + member.userHours).toFixed(2)}`;
        entry.subRows!.push({ id: project.projectId, name: project.projectName, hours: member.userHours });
        byMember.set(member.userId, entry);
      }
    }
  }

  const memberData = Array.from(byMember.values()).sort((a, b) => (b.hours ?? 0) - (a.hours ?? 0));

  return (
    <DashboardShell>
      <DashboardHeader heading="Hours by Member" text="View logged hours grouped by team member." />
      <div className="mb-8">
        <DataTable
          columns={columns}
          data={memberData}
          allClients={allClients}
          allUsers={allUsers}
          hasFullAccess={hasFullAccess}
        />
      </div>
    </DashboardShell>
  );
}
