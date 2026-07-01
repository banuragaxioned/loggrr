import { DashboardHeader } from "@/components/ui/shell";
import { DashboardShell } from "@/components/ui/shell";
import type { Metadata } from "next";
import { pageProps } from "@/types";
import { Table } from "./table";
import { getGroups } from "@/server/services/groups";
import { CreateGroupForm } from "./create-group-form";
import { getCurrentUser } from "@/server/session";
import { checkAccess, getUserRole } from "@/lib/helper";
import { notFound } from "next/navigation";
import { Role } from "@/generated/prisma/browser";

export const metadata: Metadata = {
  title: `Groups`,
};

export default async function Groups(props: pageProps) {
  const params = await props.params;
  const { team } = params;
  const user = await getCurrentUser();
  const workspaceRole = getUserRole(user?.workspaces, team);
  const hasAccess = checkAccess(workspaceRole);

  if (!hasAccess) {
    return notFound();
  }

  const groupList = await getGroups(team);
  const canManage = checkAccess(workspaceRole, [Role.MANAGER, Role.OWNER], "allow");

  return (
    <DashboardShell className="gap-6">
      <DashboardHeader heading="Groups" text="Organize members into groups for easier management.">
        {canManage && <CreateGroupForm team={team} />}
      </DashboardHeader>
      <Table data={groupList} team={team} canManage={canManage} />
    </DashboardShell>
  );
}
