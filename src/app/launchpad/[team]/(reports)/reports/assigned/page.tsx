import { DashboardShell } from "@/components/ui/shell";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { DashboardHeader } from "@/components/ui/header";
import { getAssignments } from "@/server/services/project";
import { Tenant } from "@prisma/client";
import { getAllocations } from "@/server/services/allocation";
import dayjs from "dayjs";

export default async function Assigned({ params }: { params: { team: Tenant["slug"] } }) {
  const { team } = params;
  const data = await getAssignments(team);

  const endDate = dayjs().toDate();
  const startDate = dayjs().add(14, "day").toDate();

  const options = {
    team,
    startDate,
    endDate,
    page: 1,
    pageSize: 20,
  };

  const allocation = await getAllocations(options);

  console.log(allocation);

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
