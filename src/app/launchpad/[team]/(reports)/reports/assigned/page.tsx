import { DashboardShell } from "@/components/ui/shell";
import { DataTable } from "./data-table";
import { DashboardHeader } from "@/components/ui/header";
import { getProjectsId, getAllUsers, getAllocation } from "@/server/services/allocation";
import { NewAllocationForm } from "@/components/forms/allocationForm";
import type { Metadata } from "next";
import { pageProps } from "@/types";
import { getDynamicColumns } from "./columns";
import dayjs from "dayjs";
import { addDays } from "date-fns";

export const metadata: Metadata = {
  title: `Assigned`,
};

export default async function Assigned({ params }: pageProps) {
  const startDate = new Date()
  const endDate = addDays(new Date(), 7)
  const { team } = params;
  const projects = await getProjectsId(team);
  const users = await getAllUsers(team);
  // const allocationData = await getAllocation(team,)

  return (
    <>
      <DashboardShell>
        <DashboardHeader heading="Assignments" text="This is a summary current assignments">
          <NewAllocationForm team={team} projects={projects} users={users} />
        </DashboardHeader>
        <DataTable columns={getDynamicColumns} />
      </DashboardShell>
    </>
  );
}
