import { DashboardShell } from "@/components/ui/shell";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { DashboardHeader } from "@/components/ui/header";
import { getSummary } from "@/server/services/project";
import { Tenant } from "@prisma/client";

export default async function Summary({ params }: { params: { team: Tenant["slug"] } }) {
  const { team } = params;
  const data = await getSummary(team);

  return (
    <>
      <DashboardShell>
        <DashboardHeader heading="Summary" text="This is a summary report"></DashboardHeader>
        <div className="container mx-auto">
          <DataTable columns={columns} data={data} />
        </div>
      </DashboardShell>
    </>
  );
}
