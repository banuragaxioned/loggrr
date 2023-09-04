import { DashboardShell } from "@/components/ui/shell";
import { DashboardHeader } from "@/components/ui/header";
import { AddUserInTeam } from "@/components/forms/addUserForm";
import { getMembersByProjectId } from "@/server/services/project";
import type { Metadata } from "next";
import { projectProps } from "@/types";
import { Table } from "../../../projects/[project]/members/table";

export const metadata: Metadata = {
  title: `Members`,
};

const ManageMembers = async ({ params }: projectProps) => {
  const { team, project } = params;
  const data = await getMembersByProjectId(team, +project);

  return (
    <DashboardShell>
      <DashboardHeader heading="Members" text={`This is a list of all the member in your team`}>
        {/* <AddUserInTeam team={team} /> */}
      </DashboardHeader>
      {data && <Table team={team} data={data} />}
    </DashboardShell>
  );
};

export default ManageMembers;
