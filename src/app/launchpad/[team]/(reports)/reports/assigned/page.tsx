import { DashboardShell } from "@/components/ui/shell";
import { DataTable } from "./data-table";
import { DashboardHeader } from "@/components/ui/header";
import { Tenant } from "@prisma/client";
import { getProjectsId, getAllUsers } from "@/server/services/allocation";
import { NewAllocationForm } from "@/components/forms/allocationForm";

export default async function Assigned({ params }: { params: { team: Tenant["slug"] } }) {
  const { team } = params;
  const projects = await getProjectsId(team);
  const users = await getAllUsers(team);

  return (
    <>
      <DashboardShell>
        <DashboardHeader heading="Assignments" text="This is a summary current assignments">
          {/* <NewAllocationForm team={team} projects={projects} users={users} /> */}
        </DashboardHeader>
          <DataTable team={team} />
      </DashboardShell>
    </>
  );
}
