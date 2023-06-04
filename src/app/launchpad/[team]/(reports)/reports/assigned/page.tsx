import { DashboardShell } from "@/components/ui/shell";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { DashboardHeader } from "@/components/ui/header";
import { getAssignments } from "@/server/services/project";
import { Tenant } from "@prisma/client";

export default async function Assigned({ params }: { params: { team: Tenant["slug"] } }) {
  const { team } = params;
  const data = await getAssignments(team);

  return (
    <>
      <DashboardShell>
        <DashboardHeader heading="Assignments" text="This is a summary current assignments"></DashboardHeader>
        <div className="container mx-auto">
          <DataTable columns={columns} data={data} />
        </div>
      </DashboardShell>
    </>
  );
}
