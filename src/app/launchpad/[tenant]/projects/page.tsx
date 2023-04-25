import TableUI from "@/components/ui/table";
import { db } from "@/lib/db";

export default async function Page({ params }: { params: { tenant: string } }) {
  const currentTeam = params.tenant;
  const projectDataColumns = ["name", "Client.name", "Owner.name", "status"];

  const projects = await db.project.findMany({
    where: {
      Tenant: {
        slug: currentTeam,
      },
    },
    select: {
      id: true,
      name: true,
      billable: true,
      interval: true,
      Client: { select: { id: true, name: true } },
      Owner: { select: { id: true, name: true, image: true } },
      status: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  return (
    <>
      <h3>Project List</h3>
      <TableUI rows={projects} columns={projectDataColumns} />
      {/* <h3>Client list</h3> */}
      {/* <TableUI rows={clientList.data} columns={clientDataColumns} /> */}
    </>
  );
}
