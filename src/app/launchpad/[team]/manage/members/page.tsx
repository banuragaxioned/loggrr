import { DashboardShell } from "@/components/ui/shell";
import { DashboardHeader } from "@/components/ui/header";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { AddUserInTeam } from "@/components/forms/addUserForm";
import { getMembers } from "@/server/services/members";

const ManageMembers = async ({ params }: { params: { team: string } }) => {
  const { team } = params;
  const data = await getMembers(team);

  return (
    <DashboardShell>
      <DashboardHeader heading="Members" text={`This is a list of all the member in your team`}>
        <AddUserInTeam team={team} />
      </DashboardHeader>
      {data && <DataTable columns={columns} data={data} />}
    </DashboardShell>
  );
};

export default ManageMembers;
