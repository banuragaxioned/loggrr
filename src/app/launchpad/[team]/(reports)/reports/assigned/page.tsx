import { DashboardShell } from "@/components/ui/shell";
import { Table } from "./table";
import { DashboardHeader } from "@/components/ui/header";
import { getProjectsId, getAllUsers, getAllocations } from "@/server/services/allocation";
import { NewAllocationForm } from "@/components/forms/allocationForm";
import type { Metadata } from "next";
import { pageProps } from "@/types";
import {getDynamicColumns} from "./columns";
import { DataTable } from "./data-table";

export const metadata: Metadata = {
  title: `Assigned`,
};

export default async function Assigned({ params }: pageProps) {
  const { team } = params;
  const projects = await getProjectsId(team);
  const users = await getAllUsers(team);
  return (
    <>
      <DashboardShell>
        <DashboardHeader heading="Assignments" text="This is a summary current assignments">
          <NewAllocationForm team={team} projects={projects} users={users} />
        </DashboardHeader>
        <DataTable team={team} />
        <Table columns={getDynamicColumns} data={[]}/>
      </DashboardShell>
    </>
  );
}
