import { Metadata } from "next";

import { pageProps } from "@/types";
import MilestoneData from "./milestone-data";
import { getMilestones } from "@/server/db/queries";

export const metadata: Metadata = {
  title: `Categories`,
};

export default async function Page({ params }: pageProps) {
  const { team, project } = params;

  const milestoneList = await getMilestones(project || 0, team);

  if (!project) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <MilestoneData milestoneList={milestoneList} team={team} project={project} />
    </div>
  );
}
