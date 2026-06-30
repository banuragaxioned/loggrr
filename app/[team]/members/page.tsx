import { DashboardShell } from "@/components/ui/shell";
import { DashboardHeader } from "@/components/ui/shell";
import { AddUserInTeam } from "@/components/forms/addUserForm";
import { getMembers } from "@/server/services/members";
import { getGroups } from "@/server/services/groups";
import type { Metadata } from "next";
import { pageProps } from "@/types";
import { Table } from "./table";
import { getCurrentUser } from "@/server/session";
import { checkAccess, getUserRole } from "@/lib/helper";
import { notFound } from "next/navigation";
import { Role } from "@/generated/prisma/browser";

export const metadata: Metadata = {
  title: `Members`,
};

const ManageMembers = async (props: pageProps) => {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { team } = params;
  const user = await getCurrentUser();
  const workspaceRole = getUserRole(user?.workspaces, team);
  const hasAccess = checkAccess(workspaceRole);
  const groupParam = searchParams.group;
  const parsedGroupId = groupParam ? Number.parseInt(groupParam, 10) : undefined;
  const groupId = parsedGroupId !== undefined && !Number.isNaN(parsedGroupId) ? parsedGroupId : undefined;

  if (!hasAccess) {
    return notFound();
  }

  const data = await getMembers(team, groupId);
  const userGroup = await getGroups(team);

  return (
    <DashboardShell>
      <DashboardHeader heading="Members" text="This is a list of all the member in your team">
        <AddUserInTeam team={team} />
      </DashboardHeader>
      {data && <Table team={team} data={data} userGroup={userGroup} userRole={workspaceRole as Role} />}
    </DashboardShell>
  );
};

export default ManageMembers;
