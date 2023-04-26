import TableUI from "@/components/ui/table";
import { getProjects } from "@/server/services/project";

export default async function Page({ params }: { params: { tenant: string } }) {
  const currentTeam = params.tenant;
  const projects = await getProjects(currentTeam);
  const projectDataColumns = ["name", "Client.name", "Owner.name", "status"];
  return (
    <>
      <h3>Project List</h3>
      <TableUI rows={projects} columns={projectDataColumns} />
      {/* <h3>Client list</h3> */}
      {/* <TableUI rows={clientList.data} columns={clientDataColumns} /> */}
    </>
  );
}
