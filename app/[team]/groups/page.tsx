import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import type { Metadata } from "next";
import { pageProps } from "@/types";
import { Table } from "./table";
import { columns } from "./columns";
import { getGroups } from "@/server/services/groups";
import { CreateGroupForm } from "./create-group-form";
import { getCurrentUser } from "@/server/session";
import { checkAccess, getUserRole } from "@/lib/helper";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: `Groups`,
};

export default async function Groups({ params }: pageProps) {
  const { team } = params;
  const user = await getCurrentUser();
  const workspaceRole = getUserRole(user?.workspaces, team);
  const hasAccess = checkAccess(workspaceRole);

  if (!hasAccess) {
    return notFound();
  }

  const groupList = await getGroups(team);

  return (
    <DashboardShell>
      <DashboardHeader heading="Groups" text="This is a list of all groups">
        <CreateGroupForm team={team} />
      </DashboardHeader>
      {groupList && <Table columns={columns} data={groupList} />}
    </DashboardShell>
  );
}
