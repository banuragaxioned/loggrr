import { DashboardHeader } from "components/ui/header";
import { DashboardShell } from "components/ui/shell";
import type { Metadata } from "next";
import { pageProps } from "types";
import { Table } from "./table";
import { columns } from "./columns";
import { getUserGroup } from "server/services/members";
import { Button } from "components/ui/button";
import { CreateGroupForm } from "./create-group-form";

export const metadata: Metadata = {
  title: `Groups`,
};

export default async function Groups({ params }: pageProps) {
  const { team } = params;
  const groupList = await getUserGroup(team);
  return (
    <DashboardShell>
      <DashboardHeader heading="Groups" text="This is a list of all groups">
        <CreateGroupForm team={team} />
      </DashboardHeader>
      {groupList && <Table columns={columns} data={groupList} />}
    </DashboardShell>
  );
}
