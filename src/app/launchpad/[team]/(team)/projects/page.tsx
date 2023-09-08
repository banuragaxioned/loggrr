import { getProjects } from "@/server/services/project";
import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { Table } from "./table";
import type { Metadata } from "next";
import { pageProps } from "@/types";
import { columns } from "./columns";
import { NewProjectForm } from "@/components/forms/projectForm";

export const metadata: Metadata = {
  title: `Projects`,
};
export default async function Projects({ params }: pageProps) {
  const { team } = params;
  const projectList = await getProjects(team);
  return (
    <DashboardShell>
      <DashboardHeader heading="Projects" text="This is all your projects">
        <NewProjectForm team={team}/>
      </DashboardHeader>
      {/* TODO: Update to Advanced Table, with sort (all), select columns to display */}
      {/* TODO: Clicking on the row should take you to the project details page */}
      <Table columns={columns} data={projectList} />
    </DashboardShell>
  );
}
