import { DashboardShell } from "@/components/ui/shell";
import { DashboardHeader } from "@/components/ui/header";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { AddUserInTeam } from "@/components/forms/addUserForm";
import { getMembers } from "@/server/services/members";
import type { Metadata } from 'next';
import { MetadataProps,pageProps} from "@/types";
 
export function generateMetadata({ params, searchParams }: MetadataProps): Metadata {
  return {
    title:`${params.team.replace(params.team[0],params.team[0].toUpperCase())} | Explore`
  }
}

const ManageMembers = async ({ params }: pageProps) => {
  const { team } = params;
  const data = await getMembers(team);
  generateMetadata({params})
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
