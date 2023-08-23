import { DashboardShell } from "@/components/ui/shell";
import { Table } from "./table";
import { DashboardHeader } from "@/components/ui/header";
import { getProjectsId, getAllUsers, getAllocations } from "@/server/services/allocation";
import { NewAllocationForm } from "@/components/forms/allocationForm";
import type { Metadata } from "next";
import { pageProps } from "@/types";
import {columns} from "./columns";
import { DataTable } from "./data-table";
import dayjs from "dayjs";

export const metadata: Metadata = {
  title: `Assigned`,
};

export default async function Assigned({ params }: pageProps) {
  const { team } = params;
  const projects = await getProjectsId(team);
  const users = await getAllUsers(team);
  const startDate = new Date();
  const endDate = dayjs(startDate).add(14, "day").toDate();
  const allocations = await getAllocations({
      team,
      startDate,
      endDate,
      page: 1,
      pageSize: 20,
    }
  );
const nestedTemp = await allocations.map((obj:any)=>{
  return {
    name:obj.userName,
    image:obj.userAvatar,
    subRows:[
      {
        name:obj.userName,
        image:obj.userAvatar,
      }
    ]
  }
})
  return (
    <>
      <DashboardShell>
        <DashboardHeader heading="Assignments" text="This is a summary current assignments">
          <NewAllocationForm team={team} projects={projects} users={users} />
        </DashboardHeader>
        <DataTable team={team} />
        <Table columns={columns} data={nestedTemp}/>
      </DashboardShell>
    </>
  );
}
