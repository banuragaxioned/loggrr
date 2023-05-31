import { Logged, columns } from "./columns";
import { DataTable } from "./data-table";

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
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
