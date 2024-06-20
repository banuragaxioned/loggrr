import { Metadata } from "next";

import { getTasks } from "@/server/services/project";
import { pageProps } from "@/types";
import TaskData from "./task-data";

export const metadata: Metadata = {
  title: `Tasks`,
};

export default async function Page({ params }: pageProps) {
  const { team, project } = params;

  const taskList = await getTasks(project || 0, team);

  if (!project) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <TaskData taskList={taskList} team={team} project={project} />
    </div>
  );
}
