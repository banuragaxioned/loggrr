import { DashboardShell } from "@/components/ui/shell";
import { Project, columns } from "./columns";
import { DataTable } from "./data-table";

import { getProjects } from "@/server/services/project";
import { DashboardHeader } from "@/components/ui/header";

export default async function Page({ params }: { params: { team: string } }) {
  const data = await getData();
  return (
    <>
      <DashboardShell className="m-2">
        <DashboardHeader heading="Project List" text="This is your project details page."></DashboardHeader>
        <DataTable columns={columns} data={data} />;
      </DashboardShell>
    </>
  );
}

async function getData(): Promise<Project[]> {
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ];
}
