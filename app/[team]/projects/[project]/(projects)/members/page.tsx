import { Metadata } from "next";

import { DashboardShell } from "@/components/ui/shell";
import { pageProps } from "@/types";
import { Table } from "./table";
import { getMembers, getProjectMembers } from "@/server/services/members";
import { AddMemberInProject } from "@/components/forms/addProjectMemberForm";

export const metadata: Metadata = {
  title: `Members`,
};

export default async function Page({ params }: pageProps) {
  const { team, project } = params;
  const projectId = project || 0;
  const members = await getProjectMembers({ projectId, team });

  const membersList = await getMembers(team);

  return (
    <DashboardShell>
      <AddMemberInProject team={team} project={projectId} users={membersList} />
      <Table data={members} team={team} projectId={projectId} />
    </DashboardShell>
  );
}
