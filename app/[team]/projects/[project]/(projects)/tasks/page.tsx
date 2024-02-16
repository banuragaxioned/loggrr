import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { pageProps } from "@/types";

export default async function Page({ params }: pageProps) {
  const { team, project } = params;

  // const milestoneList = await getMilestones(project || 0, team);

  if (!project) {
    return null;
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Tasks" text="Manage all the tasks for your project" />
    </DashboardShell>
  );
}
