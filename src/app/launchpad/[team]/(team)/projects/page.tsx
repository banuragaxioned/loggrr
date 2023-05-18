// import TableUI from "@/components/ui/table";
import { getProjects } from "@/server/services/project";

export default async function Page({ params }: { params: { team: string } }) {
  const { team } = params;
  const projectList = await getProjects(team);
  const projectDataColumns = ["name", "Client.name", "Owner.name", "status"];
  return (
    <>
      <h3>Project List</h3>
      {/* <TableUI rows={projectList} columns={projectDataColumns} /> */}
    </>
  );
}
