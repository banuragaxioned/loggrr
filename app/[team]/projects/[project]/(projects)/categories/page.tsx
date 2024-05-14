import { pageProps } from "@/types";
import MilestoneData from "./milestone-data";
import { getMilestones } from "@/server/services/project";
import { DashboardShell } from "@/components/ui/shell";
import { DashboardHeader } from "@/components/ui/header";

export default async function Page({ params }: pageProps) {
  const { team, project } = params;

  const milestoneList = await getMilestones(project || 0, team);

  if (!project) {
    return null;
  }

  return (
    <DashboardShell className="relative">
      <MilestoneData milestoneList={milestoneList} team={team} project={project} />
    </DashboardShell>
  );
}
