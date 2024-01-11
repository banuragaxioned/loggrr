import { DashboardShell } from "components/ui/shell";
import { DashboardHeader } from "components/ui/header";
import { AddUserInTeam } from "components/forms/addUserForm";
import { getMembers, getUserGroup } from "server/services/members";
import type { Metadata } from "next";
import { pageProps } from "types";
import { Table } from "./table";

export const metadata: Metadata = {
  title: `Members`,
};

const ManageMembers = async ({ params }: pageProps) => {
  const { team } = params;
  const data = await getMembers(team);
  const userGroup = await getUserGroup(team);

  return (
    <DashboardShell>
      <DashboardHeader heading="Members" text={`This is a list of all the member in your team`}>
        <AddUserInTeam team={team} />
      </DashboardHeader>
      {data && <Table team={team} data={data} userGroup={userGroup} />}
    </DashboardShell>
  );
};

export default ManageMembers;
