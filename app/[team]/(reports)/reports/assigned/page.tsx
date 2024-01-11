import { DashboardShell } from "@/components/ui/shell";
import { DataTable } from "./data-table";
import { DashboardHeader } from "@/components/ui/header";
import { getProjectsId, getAllUsers } from "@/server/services/allocation";
import { NewAllocationForm } from "@/components/forms/allocationForm";
import type { Metadata } from "next";
import { pageProps } from "@/types";
import { getDynamicColumns } from "./columns";

export const metadata: Metadata = {
  title: `Assigned`,
};

export default async function Assigned({ params }: pageProps) {
  const { team } = params;
  const projects = await getProjectsId(team);
  const users = await getAllUsers(team);
  return (
    <DashboardShell>
      <DashboardHeader heading="Assignments" text="This is a summary current assignments">
        <NewAllocationForm team={team} projects={projects} users={users} />
      </DashboardHeader>
      <DataTable columns={getDynamicColumns} />
    </DashboardShell>
  );
}
