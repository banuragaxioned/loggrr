import { getClients } from "@/server/services/project";
import { getAllUsers } from "@/server/services/allocation";
import { NewProjectForm } from "@/components/forms/projectForm";

export const AddProject = async ({ team }: { team: string }) => {
  const clients = await getClients(team);
  const users = await getAllUsers(team);

  return <NewProjectForm clients={clients} users={users} team={team} />;
};
