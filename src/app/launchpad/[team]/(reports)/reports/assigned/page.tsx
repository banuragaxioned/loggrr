import { DashboardShell } from "@/components/ui/shell";
import { DataTable } from "./data-table";
import { DashboardHeader } from "@/components/ui/header";
import { getProjectsId, getAllUsers } from "@/server/services/allocation";
import { NewAllocationForm } from "@/components/forms/allocationForm";
import { AllocationFrequency, Tenant } from "@prisma/client";
import type { Metadata } from 'next';
import { MetadataProps,pageProps} from "@/types";
 
export function generateMetadata({ params, searchParams }: MetadataProps): Metadata {
  return {
    title:`${params.team.replace(params.team[0],params.team[0].toUpperCase())} | Assigned`
  }
}

export default async function Assigned({ params }:pageProps) {
  const { team } = params;
  const projects = await getProjectsId(team);
  const users = await getAllUsers(team);
  generateMetadata({params})
  return (
    <>
      <DashboardShell>
        <DashboardHeader heading="Assignments" text="This is a summary current assignments">
          <NewAllocationForm team={team} projects={projects} users={users} />
        </DashboardHeader>
        <DataTable team={team} />
      </DashboardShell>
    </>
  );
}
