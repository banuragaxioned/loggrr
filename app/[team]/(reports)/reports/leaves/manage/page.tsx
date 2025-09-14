import type { Metadata } from "next";
import { pageProps } from "@/types";

import { DashboardShell } from "@/components/ui/shell";
import { DashboardHeader } from "@/components/ui/shell";

import { getCurrentUser } from "@/server/session";
import { checkAccess, getUserRole } from "@/lib/helper";
import { notFound } from "next/navigation";
import { getLeaves } from "@/server/services/leaves";
import { getMembers } from "@/server/services/members";
import { LeaveForm } from "@/components/forms/leaveForm";

import { Table } from "./table";

export const metadata: Metadata = {
  title: `Manage Leaves`,
};

export default async function Page({ params }: pageProps) {
  const user = await getCurrentUser();
  const workspaceRole = getUserRole(user?.workspaces, params.team);
  const grantAccess = ["HR", "OWNER"];
  const hasAccess = checkAccess(workspaceRole, grantAccess, "allow");
  const leaves = await getLeaves(params.team);
  const users = await getMembers(params.team);

  if (!user || !hasAccess) {
    return notFound();
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Manage Leaves" text="View and manage all members leave status for the current year.">
        <LeaveForm team={params.team} users={users} leaves={leaves} />
      </DashboardHeader>
      <Table data={leaves} />
    </DashboardShell>
  );
}
