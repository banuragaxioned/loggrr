import { DashboardShell } from "@/components/ui/shell";
import { DashboardHeader } from "@/components/ui/header";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { AddUserInTeam } from "@/components/forms/addUserForm";
import { getMembers } from "@/server/services/members";
import type { Metadata } from "next";
import { pageProps } from "@/types";

export const metadata: Metadata = {
  title:`Members`
};

const ManageMembers = async ({ params }: pageProps) => {
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
