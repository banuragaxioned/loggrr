import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { getTasks } from "@/server/services/project";
import { pageProps } from "@/types";
import TaskData from "./task-data";

export default async function Page({ params }: pageProps) {
  const { team, project } = params;

  const taskList = await getTasks(project || 0, team);

  if (!project) {
    return null;
  }

  return (
    <DashboardShell className="relative">
      <DashboardHeader heading="Tasks" text="Manage all the tasks for your project" />
      <TaskData taskList={taskList} team={team} project={project} />
    </DashboardShell>
  );
}
