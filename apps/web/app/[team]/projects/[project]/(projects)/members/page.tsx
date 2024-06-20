import { Metadata } from "next";
import { pageProps } from "@/types";
import { getMembers, getProjectMembers } from "@/server/services/members";
import { AddMemberInProject } from "@/components/forms/addProjectMemberForm";
import { Table } from "./table";

export const metadata: Metadata = {
  title: `Members`,
};

export default async function Page({ params }: pageProps) {
  const { team, project } = params;
  const projectId = project || 0;
  const members = await getProjectMembers({ projectId, team });

  const membersList = await getMembers(team);

  return (
    <div className="flex flex-col gap-4">
      <AddMemberInProject team={team} project={projectId} users={membersList} />
      <Table data={members} team={team} projectId={projectId} />
    </div>
  );
}
