import { Fragment } from "react";
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
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { DataTableToolbar } from "../../components/toolbar";

export const metadata: Metadata = {
  title: `Report`,
};

const formatHours = (hours?: number) => (hours ? `${hours} h` : "—");

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
    <div className="flex flex-col gap-4">
      <DataTableToolbar
        isBillable={isBillable}
        allMembers={allMembers}
        allCategories={allCategories}
        allTasks={allTasks}
      />

      {matrix.members.length === 0 ? (
        <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
          No time logged in the selected period.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[220px]">Category / Task</TableHead>
                {matrix.members.map((member) => (
                  <TableHead key={member.id} className="text-right">
                    {member.name}
                  </TableHead>
                ))}
                <TableHead className="text-right font-semibold">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matrix.categories.map((category) => (
                <Fragment key={category.id}>
                  <TableRow className="bg-muted/50 font-medium">
                    <TableCell>{category.name}</TableCell>
                    {matrix.members.map((member) => (
                      <TableCell key={member.id} className="text-right">
                        {formatHours(category.cells[member.id])}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">{formatHours(category.total)}</TableCell>
                  </TableRow>
                  {category.tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="pl-8 text-muted-foreground">{task.name}</TableCell>
                      {matrix.members.map((member) => (
                        <TableCell key={member.id} className="text-right text-muted-foreground">
                          {formatHours(task.cells[member.id])}
                        </TableCell>
                      ))}
                      <TableCell className="text-right text-muted-foreground">{formatHours(task.total)}</TableCell>
                    </TableRow>
                  ))}
                </Fragment>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="font-semibold">
                <TableCell>Total</TableCell>
                {matrix.members.map((member) => (
                  <TableCell key={member.id} className="text-right">
                    {formatHours(matrix.memberTotals[member.id])}
                  </TableCell>
                ))}
                <TableCell className="text-right">{formatHours(matrix.grandTotal)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}
    </div>
  );
}
