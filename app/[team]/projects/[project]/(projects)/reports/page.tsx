import { Metadata } from "next";

import { pageProps } from "@/types";
import {
  getMembersNameInTimeEntries,
  getMilestonesInProject,
  getProjectDetailsById,
  getProjectMatrix,
  getTasksInProject,
} from "@/server/services/project";
import { getStartandEndDates } from "@/lib/months";

import { DataTableToolbar } from "../../components/toolbar";
import { ProjectMatrix } from "./matrix";

export const metadata: Metadata = {
  title: `Report`,
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { team, project } = params;

  if (!project) {
    return null;
  }

  const projectId = +project;
  const { startDate, endDate } = getStartandEndDates(searchParams.range, 30);

  const [matrix, allMembers, allCategories, allTasks, projectDetails] = await Promise.all([
    getProjectMatrix(
      team,
      projectId,
      startDate,
      endDate,
      searchParams.billable,
      searchParams.members,
      searchParams.category,
      searchParams.task,
    ),
    getMembersNameInTimeEntries(team, projectId),
    getMilestonesInProject(team, projectId),
    getTasksInProject(team, projectId),
    getProjectDetailsById(team, projectId),
  ]);
  const isBillable = projectDetails?.billable ?? false;

  return (
    <div className="flex flex-col">
      <DataTableToolbar
        isBillable={isBillable}
        allMembers={allMembers}
        allCategories={allCategories}
        allTasks={allTasks}
      />
      <ProjectMatrix data={matrix} />
    </div>
  );
}
