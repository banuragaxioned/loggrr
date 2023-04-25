import TableUI from "@/components/ui/table";
import { db } from "@/lib/db";

export default async function Page({ params }: { params: { tenant: string } }) {
  const currentTeam = params.tenant;
  const projectDataColumns = ["name", "name", "status"];

  const projects = await db.client.findMany({
    where: {
      Tenant: {
        slug: currentTeam,
      },
    },
    select: {
      id: true,
      name: true,
      status: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  return (
    <>
      <h3>Client List</h3>
      <TableUI rows={projects} columns={projectDataColumns} />
    </>
  );
}
