import { DashboardShell } from "@/components/ui/shell";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { DashboardHeader } from "@/components/ui/header";
import { getProjectSummary } from "@/server/services/project";
import { Tenant } from "@prisma/client";

export default async function Page({ params }: { params: { team: Tenant["slug"] } }) {
  const { team } = params;
  const data = await getProjectSummary(team);

  return (
    <DashboardShell>
      <DashboardHeader heading="Reports"></DashboardHeader>
      <DataTable columns={columns} data={data} />
    </DashboardShell>
  );
}
