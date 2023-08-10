import { getMembers } from "@/server/services/members";
import { DashboardShell } from "@/components/ui/shell";
import { DashboardHeader } from "@/components/ui/header";
import { DataTable } from "./data-table";
import { AddUserInTeam } from "@/components/forms/addUserForm";

const Members = async ({ params }: { params: { team: string } }) => {
  const { team } = params;
  const members = await getMembers(team);

  return (
    <DashboardShell>
      <DashboardHeader heading="Members" text={`This is a list of  all the member in ${team} team `}>
        <AddUserInTeam team={team}/>
      </DashboardHeader>
      <DataTable data={members} />
    </DashboardShell>
  );
};

export default Members;
