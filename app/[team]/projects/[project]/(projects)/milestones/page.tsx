import { NewMilestoneForm } from "@/components/forms/milestonesForm";
import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { db } from "@/server/db";
import { pageProps } from "@/types";
import MilestoneData from "./milestone-data";

export default async function Page({ params }: pageProps) {
  const { team, project } = params;

  if (!project) {
    return null;
  }

  const milestoneList = await db.milestone.findMany({
    where: {
      workspace: {
        slug: team,
      },
      project: {
        id: +project,
      },
    },
  });

  return (
    <DashboardShell>
      <DashboardHeader heading="Milestones" text="Manage all the Milestones for your project">
        <NewMilestoneForm project={project} team={team} />
      </DashboardHeader>

      <MilestoneData milestoneList={milestoneList} team={team} project={project} />
    </DashboardShell>
  );
}
