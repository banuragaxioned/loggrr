import type { Metadata } from "next";
import { getProjects, getClients } from "@/server/services/project";
import { getAllUsers } from "@/server/services/allocation";
import { NewProjectForm } from "@/components/forms/projectForm";
import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { type pageProps } from "@/types";
import { Table } from "./table";
import { columns } from "./columns";

export const metadata: Metadata = {
  title: `Projects`,
};

export default async function Projects({ params }: pageProps) {
  const { team } = params;
  const projectList = await getProjects(team);
  const clients = await getClients(team);
  const users = await getAllUsers(team);

  return (
    <DashboardShell>
      <DashboardHeader heading="Projects" text="You can find the list of projects here">
        <NewProjectForm clients={clients} users={users} team={team} />
      </DashboardHeader>
      <Table columns={columns} data={projectList} />
    </DashboardShell>
  );
}
