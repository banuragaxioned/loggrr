import { DashboardShell } from "@/components/ui/shell";
import { DashboardHeader } from "@/components/ui/header";
import { AddUserInTeam } from "@/components/forms/addUserForm";
import { getMembers } from "@/server/services/members";
import type { Metadata } from "next";
import { pageProps } from "@/types";
import { Table } from "./table";
import { GetColumn } from "./columns";

export const metadata: Metadata = {
  title: `Members`,
};

const ManageMembers = async ({ params }: pageProps) => {
  const { team } = params;
  const data = await getMembers(team);
  return (
    <DashboardShell>
      <DashboardHeader heading="Members" text={`This is a list of all the member in your team`}>
        <AddUserInTeam team={team} />
      </DashboardHeader>
      {data && <Table columns={GetColumn} team={team} data={data} />}
    </DashboardShell>
  );
};

export default ManageMembers;
