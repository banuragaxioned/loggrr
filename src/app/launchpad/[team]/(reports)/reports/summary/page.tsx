import { DashboardShell } from "@/components/ui/shell";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { DashboardHeader } from "@/components/ui/header";
import { getProjectSummary } from "@/server/services/project";
import { Tenant } from "@prisma/client";
import type { Metadata } from 'next';
import { MetadataProps,pageProps} from "@/types";
 
export function generateMetadata({ params, searchParams }: MetadataProps): Metadata {
  return {
    title:`${params.team.replace(params.team[0],params.team[0].toUpperCase())} | Summary`
  }
}


export default async function Page({ params }: pageProps) {
  const { team } = params;
  const data = await getProjectSummary(team);
  generateMetadata({params})
  return (
    <DashboardShell>
      <DashboardHeader heading="Reports"></DashboardHeader>
      <DataTable columns={columns} data={data} />
    </DashboardShell>
  );
}
