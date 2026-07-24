import { Fragment } from "react";
import {
  CalendarClock,
  CircleDollarSign,
  Edit,
  List,
  ListRestart,
  MessageSquare,
  Milestone as CategoryIcon,
  Trash,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { getRandomColor } from "@/lib/random-colors";
import { TimeEntryDataObj } from "@/types";

import { Skeleton } from "./ui/skeleton";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
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
import { CustomTooltip } from "./custom/tooltip";

interface TimeEntries {
  entries: TimeEntryDataObj;
  status: string;
  deleteEntryHandler: (id: number) => void;
  editEntryHandler: (obj: SelectedData, id: number) => void;
  edit: EditReferenceObj;
  /** Board right panel: grow and scroll within the available viewport height */
  fillHeight?: boolean;
}

export const TimeEntriesList = ({
  entries,
  status,
  deleteEntryHandler,
  editEntryHandler,
  edit,
  fillHeight = false,
}: TimeEntries) => {
  const renderEntries = Array.isArray(entries.projectsLog) ? (
    entries.projectsLog.map((entryData, projectIndex) => (
      <li key={entryData.project.id}>
        <Card
          className={cn(
            "overflow-hidden rounded-none border-x-0 border-b-0 shadow-none",
            // Day total already provides the top rule in board fill-height mode
            fillHeight && projectIndex === 0 ? "border-t-0" : "border-t",
          )}
        >
          <div
            className={cn(
              "flex w-full items-start justify-between gap-2",
              fillHeight ? "px-3 py-2.5" : "px-5 py-2",
            )}
          >
            <div className="flex min-w-0 flex-1 items-start gap-2">
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: getRandomColor(entryData.project.id) }}
              >
                {entryData.project.client?.name?.charAt(0) ?? entryData.project.name.charAt(0)}
              </span>
              <div
                className="min-w-0 flex-1"
                title={
                  entryData.project.client?.name
                    ? `${entryData.project.name} · ${entryData.project.client.name}`
                    : entryData.project.name
                }
              >
                <p className="text-sm leading-snug font-medium wrap-break-word">{entryData.project.name}</p>
                {entryData.project.client?.name ? (
                  <p className="text-muted-foreground text-xs leading-snug wrap-break-word">
                    {entryData.project.client.name}
                  </p>
                ) : null}
              </div>
            </div>
            <span className="shrink-0 pt-0.5 text-sm font-semibold tabular-nums">
              {entryData.total.toFixed(2)} h
            </span>
          </div>

          <Separator />

          {entryData.data.map((data, i) => {
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
            const messageFor = entryData.project.status === "ARCHIVED" ? "Project" : "";
            const isLastEntry = i === entryData.data.length - 1;
            const hasMeta = Boolean(data.milestone?.name || data.task?.name);

            return (
              <Fragment key={data.id}>
                <div
                  className={cn(
                    "group bg-secondary relative flex justify-between gap-3 px-5 py-2",
                    isEditing && "ring-muted-foreground ring-1 ring-inset",
                  )}
                >
                  <div className={cn("flex min-w-0 flex-1 flex-col gap-y-2", !hasMeta && "justify-end")}>
                    {hasMeta ? (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {data.milestone?.name ? (
                          <Badge
                            variant="outline"
                            className="bg-background border-border inline-flex max-w-full items-center font-normal"
                            title={`Category: ${data.milestone.name}`}
                          >
                            <CategoryIcon size={12} className="mr-1 shrink-0" />
                            <span className="truncate">{data.milestone.name}</span>
                          </Badge>
                        ) : null}
                        {data.task?.name ? (
                          <Badge
                            variant="outline"
                            className="bg-background border-border inline-flex max-w-full items-center font-normal"
                            title={`Task: ${data.task.name}`}
                          >
                            <List size={12} className="mr-1 shrink-0" />
                            <span className="truncate">{data.task.name}</span>
                          </Badge>
                        ) : null}
                      </div>
                    ) : null}
                    <p
                      className="text-muted-foreground border-foreground/20 flex items-start gap-1.5 p-0.5 text-[13px] leading-snug"
                      title={data.comments ?? undefined}
                    >
                      <MessageSquare size={12} className="mt-0.5 mr-1 shrink-0 opacity-70" />
                      <span className="min-w-0 flex-1 wrap-break-word whitespace-pre-wrap">
                        {data.comments?.trim() || <span className="italic opacity-70">No comment added</span>}
                      </span>
                    </p>
                  </div>

                  <div className="flex min-w-25 shrink-0 flex-col justify-between text-right select-none">
                    <div className="flex items-center justify-end gap-1.5">
                      <div
                        className={cn(
                          "flex items-center gap-1",
                          "opacity-100 md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100",
                          isEditing && "md:opacity-100",
                        )}
                      >
                        <CustomTooltip
                          trigger={
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="bg-background h-7 w-7"
                              onClick={() => {
                                if (isEditable) editEntryHandler(tempObj, data.id);
                                else toast.message(`${messageFor} archived. No modifications allowed.`);
                              }}
                              aria-label={isEditing ? "Cancel edit" : "Edit entry"}
                            >
                              {isEditing ? <ListRestart size={14} /> : <Edit size={14} />}
                            </Button>
                          }
                          content={isEditing ? "Cancel edit" : "Edit"}
                        />

                        {isEditable ? (
                          <Dialog>
                            <CustomTooltip
                              trigger={
                                <DialogTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="bg-background text-destructive hover:text-destructive h-7 w-7"
                                    aria-label="Delete entry"
                                  >
                                    <Trash size={14} />
                                  </Button>
                                </DialogTrigger>
                              }
                              content="Delete"
                            />
                            <DialogContent className="sm:max-w-106.25">
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
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="bg-background text-destructive hover:text-destructive h-7 w-7"
                            aria-label="Delete entry"
                            onClick={() => toast.message(`${messageFor} archived. No modifications allowed.`)}
                          >
                            <Trash size={14} />
                          </Button>
                        )}
                      </div>
                      <span className="text-muted-foreground shrink-0 text-sm font-semibold tabular-nums">
                        {data.time.toFixed(2)} h
                      </span>
                    </div>

                    {data.billable && (
                      <CustomTooltip
                        trigger={
                          <span className="text-success ml-auto inline-flex" aria-label="Billable">
                            <CircleDollarSign size={16} />
                          </span>
                        }
                        content="Billable"
                      />
                    )}
                  </div>
                </div>
                {!isLastEntry ? <Separator /> : null}
              </Fragment>
            );
          })}
        </Card>
      </li>
    ))
  ) : (
    <li
      className={cn(
        "flex flex-col items-center justify-center space-y-3 px-6 py-14 text-center sm:py-16",
        fillHeight ? "min-h-0 flex-1" : "border-t",
      )}
    >
      <div className="bg-muted flex h-14 w-14 items-center justify-center rounded-full">
        <CalendarClock size={28} className="text-muted-foreground" />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-foreground text-2xl font-semibold">No timesheet entries</h2>
        <p className="text-muted-foreground mx-auto max-w-100 text-sm">
          You haven&apos;t logged any time for the selected date yet.
        </p>
      </div>
    </li>
  );

  const skeletonLoader = (
    <li className={cn("p-2", !fillHeight && "border-t")}>
      <div className="mb-2 flex items-center justify-between gap-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-1/4" />
      </div>
      <div className="mb-2 flex flex-col gap-2">
        <div className="flex justify-between">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </li>
  );

  return (
    <ul
      className={cn(
        "flex w-full flex-col overflow-y-auto",
        fillHeight ? "min-h-0 flex-1" : entries.projectsLog?.length && "max-h-none sm:max-h-[calc(100vh-306px)]",
      )}
    >
      {status === "loading" && skeletonLoader}
      {status === "success" && renderEntries}
      {status === "error" && <li className="text-destructive p-4 text-center text-sm">Something went wrong</li>}
    </ul>
  );
};
