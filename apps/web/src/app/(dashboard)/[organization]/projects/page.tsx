import { DashboardHeader, DashboardShell } from "@/components/shell";
import { ProjectsList } from "./projects-list";

export default function ProjectsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Projects" text="You can find the list of projects here"></DashboardHeader>
      <ProjectsList />
    </DashboardShell>
  );
}
