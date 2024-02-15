
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
    <div>
      <MilestoneData milestoneList={milestoneList} team={team} project={project}/>
    </div>
  );
}
