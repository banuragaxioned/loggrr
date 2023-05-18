// import TableUI from "@/components/ui/table";
import { getClients } from "@/server/services/project";

export default async function Page({ params }: { params: { team: string } }) {
  const { team } = params;
  const clientList = await getClients(team);
  const projectDataColumns = ["name", "name", "status"];
  return (
    <>
      <h3>Client List</h3>
      {/* <TableUI rows={clientList} columns={projectDataColumns} /> */}
    </>
  );
}
