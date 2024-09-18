import type { Metadata } from "next";
import { getProjects, getClients } from "@/server/services/project";
import { getAllUsers } from "@/server/services/allocation";
import { NewProjectForm } from "@/components/forms/projectForm";
import { DashboardHeader } from "@/components/ui/shell";
import { DashboardShell } from "@/components/ui/shell";
import { pageProps } from "@/types";
import { Table } from "./table";
import { columns } from "./columns";
import { getCurrentUser } from "@/server/session";
import { checkAccess, getUserRole } from "@/lib/helper";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: `Projects`,
};

export default async function Projects({ params, searchParams }: pageProps) {
  const user = await getCurrentUser();
  const { team } = params;
  const workspaceRole = getUserRole(user?.workspaces, team);
  const hasAccess = checkAccess(workspaceRole);

  if (!hasAccess) {
    return notFound();
  }

  const { status, clients: selectedClients } = searchParams;
  const projectList = await getProjects(team, status, selectedClients);
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
