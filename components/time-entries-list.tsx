import { Fragment } from "react";
import { CalendarClock, Edit, List, ListRestart, MessageSquare, Milestone as CategoryIcon, Trash } from "lucide-react";

import { cn } from "@/lib/utils";
import { getRandomColor } from "@/lib/random-colors";
import { TimeEntryDataObj } from "@/types";

import { Skeleton } from "./ui/skeleton";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";

import { EditReferenceObj } from "./time-entry";
import { SelectedData } from "./forms/timelogForm";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { toast } from "sonner";

interface TimeEntries {
  entries: TimeEntryDataObj;
  status: string;
  deleteEntryHandler: (id: number) => void;
  editEntryHandler: (obj: SelectedData, id: number) => void;
  edit: EditReferenceObj;
}

export const TimeEntriesList = ({ entries, status, deleteEntryHandler, editEntryHandler, edit }: TimeEntries) => {
  const renderEntries = Array.isArray(entries.projectsLog) ? (
    entries.projectsLog.map((entryData, projectIndex) => (
      <li key={entryData.project.id} className="">
        {/* Project related details  */}
        <Card className="overflow-hidden rounded-none border-x-0 border-b-0 border-t shadow-none">
          <div className="flex w-full items-center justify-between px-5 py-2">
            <p className="flex items-center gap-x-2 pr-1.5 text-sm font-medium">
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: getRandomColor(entryData.project.id) }}
              >
                {entryData?.project?.name.charAt(0)}
              </span>
              {entryData?.project?.name} - {entryData?.project.client?.name}
            </p>
            <span className="shrink-0 text-sm font-semibold normal-nums">{entryData?.total.toFixed(2)} h</span>
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
              billable: data.billable,
              comment: data.comments,
              client: entryData.project.client,
              project: projectObj,
              time: `${data.time.toFixed(2)}`,
            };

            const isEditing = edit.isEditing && edit.id === data.id;
            const isEditable = entryData.project.status !== "ARCHIVED";

            return (
              <Fragment key={i}>
                <div
                  className={cn(
                    "group relative box-border flex justify-between border border-transparent bg-secondary px-5 py-2 last:mb-0",
                    isEditing && "border-muted-foreground",
                    entries?.projectsLog &&
                      projectIndex === entries.projectsLog.length - 1 &&
                      i === entryData?.data.length - 1 &&
                      "rounded-b-xl",
                  )}
                >
                  <div
                    className={cn(
                      "flex flex-col justify-between gap-y-4",
                      !data.milestone && !data.task && "justify-end",
                    )}
                  >
                    <div className="flex flex-col gap-y-2">
                      {data.milestone?.name && (
                        <p
                          className="flex items-center gap-1.5 gap-x-[12px] text-sm font-medium opacity-60"
                          title="Category"
                        >
                          <CategoryIcon size={17} className="shrink-0" /> {data.milestone.name}
                        </p>
                      )}
                      {data.task?.name && (
                        <p className="flex items-center gap-x-[12px] text-sm font-medium opacity-60" title="Task">
                          <List size={16} className="shrink-0" /> {data.task.name}
                        </p>
                      )}
                      <p className="flex items-center gap-x-[12px] text-sm opacity-60" title="Comment">
                        <MessageSquare size={15} className="shrink-0" />
                        {data?.comments}
                      </p>
                    </div>
                  </div>
                  <div className="flex min-w-[100px] select-none flex-col justify-between text-right">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="mr-2 flex justify-end gap-x-1 md:invisible md:group-hover:visible">
                        <span
                          onClick={() => {
                            if (isEditable) {
                              editEntryHandler(tempObj, data.id);
                            } else {
                              toast.message("You can't edit an archived project time entry");
                            }
                          }}
                          className="cursor-pointer rounded-md border bg-white p-1 hover:opacity-75 dark:bg-black"
                        >
                          {isEditing ? <ListRestart size={16} /> : <Edit size={16} />}
                        </span>
                        {/* Open a modal on delete click */}
                        {isEditable ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <span className="cursor-pointer rounded-md border bg-white p-1 text-destructive hover:opacity-75 dark:bg-black">
                                <Trash size={16} />
                              </span>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Are you sure to delete this time entry?</DialogTitle>
                                <DialogDescription>
                                  This action cannot be undone. This will permanently delete your time entry.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button type="button" variant="outline" size="sm" asChild>
                                  <DialogClose>Cancel</DialogClose>
                                </Button>
                                <Button type="button" size="sm" onClick={() => deleteEntryHandler(data.id)} asChild>
                                  <DialogClose>Delete</DialogClose>
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <span
                            className="cursor-pointer rounded-md border bg-white p-1 text-destructive hover:opacity-75 dark:bg-black"
                            onClick={() => {
                              toast.message("You can't delete an archived project time entry");
                            }}
                          >
                            <Trash size={16} />
                          </span>
                        )}
                      </div>
                      <span className="shrink-0 text-sm font-semibold normal-nums opacity-60">
                        {data?.time.toFixed(2)} h
                      </span>
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
    <li className="flex flex-col items-center justify-center space-y-2 p-11 text-center">
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
    <ul
      className={cn(
        "flex w-full flex-col overflow-y-auto",
        entries.projectsLog?.length && "max-h-none sm:max-h-[calc(100vh-306px)]",
      )}
    >
      {status === "loading" && skeletonLoader}
      {status === "success" && renderEntries}
      {status === "error" && <li className="p-4 text-center text-destructive">Something went wrong</li>}
    </ul>
  );
};
