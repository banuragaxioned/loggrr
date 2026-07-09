import type { Metadata } from "next";
import { pageProps } from "@/types";

import { getLogged } from "@/server/services/time-entry";
import { getStartandEndDates } from "@/lib/months";
import { buildLoggedTreeByGroup, buildLoggedTreeByMember } from "@/lib/logged-transform";
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
  const selectedGroups = searchParams.groups;
  const view = searchParams.view === "groups" ? "groups" : "members";
  const { startDate, endDate } = getStartandEndDates(selectedRange);
  const shouldUseBillableBudgetHours = selectedBilling === "true";
  const {
    data: loggedData,
    allClients,
    allUsers,
    allGroups,
  } = await getLogged(
    params.team,
    startDate,
    endDate,
    selectedBilling,
    selectedProject,
    selectedClients,
    selectedMembers,
    selectedGroups,
    hasFullAccess,
  );

  const transformOptions = { shouldUseBillableBudgetHours };
  const transformedData =
    view === "groups"
      ? buildLoggedTreeByGroup(loggedData, transformOptions)
      : buildLoggedTreeByMember(loggedData, transformOptions);

  return (
    <DashboardShell>
      <DashboardHeader heading="Logged Hours" text="View the hours that are logged." />
      <div className="mb-8">
        <DataTable
          columns={columns}
          data={transformedData as Logged[]}
          allClients={allClients}
          allUsers={allUsers}
          allGroups={allGroups}
          hasFullAccess={hasFullAccess}
        />
      </div>
    </DashboardShell>
  );
}
