import { Fragment } from "react";
import { CalendarClock, Edit, ListRestart, Trash } from "lucide-react";

import { getRandomColor } from "@/lib/random-colors";
import { TimeEntryData } from "@/types";

import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";

import { EditReferenceObj } from "./time-entry";
import { SelectedData } from "./forms/timelogForm";

interface TimeEntries {
  entries: TimeEntryData;
  status: string;
  deleteEntryHandler: (id: number) => void;
  editEntryHandler: (obj: SelectedData, id: number) => void;
  edit: EditReferenceObj;
}

export const TimeEntriesList = ({ entries, status, deleteEntryHandler, editEntryHandler, edit }: TimeEntries) => {
  const renderEntries = Array.isArray(entries.projectsLog) ? (
    entries.projectsLog.map((entryData) => (
      <li key={entryData.project.id} className="px-2">
        {/* Project related details  */}
        <Card className="overflow-hidden shadow-none">
          <div className="flex w-full justify-between px-3 py-2">
            <p className="flex items-center gap-x-2 text-sm font-medium">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: getRandomColor(entryData.project.id) }}
              >
                {entryData?.project?.name.charAt(0)}
              </span>
              {entryData?.project?.name} - {entryData?.project.client?.name}
            </p>
            <span className="text-sm font-semibold normal-nums">{entryData?.total.toFixed(2)} h</span>
          </div>
          <Separator className="dark:bg-white/20" />
          {/* Milestones data */}
          {entryData?.data?.map((data, i) => {
            const projectObj = {
              id: entryData.project.id,
              name: entryData.project.name,
              billable: entryData.project.billable,
            };
            const tempObj = {
              ...data,
              comment: data.comments,
              client: entryData.project.client,
              project: projectObj,
              time: `${data.time}`,
            };

            return (
              <Fragment key={i}>
                <div className="group relative flex justify-between bg-secondary px-3 py-2 last:mb-0">
                  <div className="flex flex-col justify-between gap-y-4">
                    <div className="flex flex-col gap-y-2">
                      {data.milestone?.name && (
                        <p className="flex items-center gap-1.5 gap-x-1 text-sm font-medium opacity-80">
                          Milestone - {data.milestone.name}
                        </p>
                      )}
                      {data.task?.name && (
                        <p className="flex items-center gap-x-1 text-sm font-medium">Task - {data.task.name}</p>
                      )}
                      <p className="flex items-center gap-x-1 text-sm opacity-60">{data?.comments}</p>
                    </div>
                  </div>
                  <div className="flex min-w-[100px] flex-col text-right">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="mr-2 flex justify-end gap-x-1 md:invisible md:group-hover:visible">
                        <span
                          onClick={() => editEntryHandler(tempObj, data.id)}
                          className="cursor-pointer rounded border bg-white p-1 hover:opacity-75 dark:bg-black"
                        >
                          {edit.isEditing ? <ListRestart size={16} /> : <Edit size={16} />}
                        </span>
                        <span
                          onClick={() => deleteEntryHandler(data.id)}
                          className="cursor-pointer rounded border bg-white p-1 text-destructive hover:opacity-75 dark:bg-black"
                        >
                          <Trash size={16} />
                        </span>
                      </div>
                      <span className="text-sm font-semibold normal-nums opacity-60">{data?.time.toFixed(2)} h</span>
                    </div>
                    {/* Billing Status */}
                    {data?.billable ? (
                      <span className="text-sm text-success">Billable</span>
                    ) : (
                      <span className="text-sm">Non-Billable</span>
                    )}
                  </div>
                </div>
                {i !== entryData?.data.length - 1 && <Separator className="dark:bg-white/20" />}
              </Fragment>
            );
          })}
        </Card>
      </li>
    ))
  ) : (
    <li className="flex flex-col items-center justify-center space-y-2 p-12 text-center">
      <CalendarClock size={32} />
      <h2>No Timesheet Entries</h2>
      <p>You haven&apos;t made any timesheet entries for the selected date.</p>
    </li>
  );

  const skeletonLoader = (
    <div className="p-2">
      <div className="mb-2 flex items-center justify-between gap-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-1/4" />
      </div>
      <div className="mb-2 flex flex-col gap-2">
        <div className="flex justify-between">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-[80px]" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-[80px]" />
        </div>
      </div>
    </div>
  );

  return (
    <ul className="flex w-full flex-col gap-y-2 overflow-y-auto pb-2">
      {status === "loading" && skeletonLoader}
      {status === "success" && renderEntries}
      {status === "error" && <li className="p-4 text-center text-destructive">Something went wrong</li>}
    </ul>
  );
};
