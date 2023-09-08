import { DashboardShell } from "@/components/ui/shell";
import { DashboardHeader } from "@/components/ui/header";
import { AddMemberInProject } from "@/components/forms/addProjectMemberForm";
import { getMembersByProjectId } from "@/server/services/project";
import type { Metadata } from "next";
import { projectProps } from "@/types";
import { Table } from "../../../projects/[project]/members/table";
import { getAllUsers } from "@/server/services/allocation";

export const metadata: Metadata = {
  title: `Members`,
};

const ManageMembers = async ({ params }: projectProps) => {
  const { team, project } = params;
  const data = await getMembersByProjectId(team, +project);
  const users = await getAllUsers(team);

  return (
    <DashboardShell>
      <DashboardHeader heading="Members" text={`This is a list of all the member in your team`}>
        <AddMemberInProject team={team} project={+project} users={users} />
      </DashboardHeader>
      {data && <Table team={team} data={data} />}
    </DashboardShell>
  );
};

export default ManageMembers;
