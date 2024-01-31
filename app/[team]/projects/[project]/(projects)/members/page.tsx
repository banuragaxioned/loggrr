import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { pageProps } from "@/types";
import { Table } from "./table";
import { getProjectMembers } from "../../../../../../server/services/members";

export default async function Page({ params }: pageProps) {
  const { team, project } = params;
  const projectId = +project!
  const members = await getProjectMembers({ projectId, team });

  return (
    <DashboardShell>
      <DashboardHeader heading="Manage project team" text="People who are assigned to this project">
        <Button variant="outline">Edit</Button>
      </DashboardHeader>
      <Table data={members} team={team} projectId={projectId}/>
    </DashboardShell>
  );
}
