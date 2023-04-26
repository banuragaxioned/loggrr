import TableUI from "@/components/ui/table";
import { getClients } from "@/server/services/project";

export default async function Page({ params }: { params: { tenant: string } }) {
  const currentTeam = params.tenant;
  const clientList = await getClients(currentTeam);
  const projectDataColumns = ["name", "name", "status"];
  return (
    <>
      <h3>Client List</h3>
      <TableUI rows={clientList} columns={projectDataColumns} />
    </>
  );
}
