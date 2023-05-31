import { DashboardShell } from "@/components/ui/shell";
import { Logged, columns } from "./columns";
import { DataTable } from "./data-table";
import { DashboardHeader } from "@/components/ui/header";

async function getData(): Promise<Logged[]> {
  // Fetch data from your API here.
  return [
    {
      id: 8,
      hours: 3,
      name: "Anurag",
    },
    {
      id: 1,
      hours: 2,
      name: "Rudolph",
    },
    {
      id: 1,
      hours: 1,
      name: "Kashif",
    },
    {
      id: 3,
      hours: 10,
      name: "Ajay",
    },
    // ...
  ];
}

export default async function DemoPage() {
  const data = await getData();

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
