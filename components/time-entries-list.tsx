import { Skeleton } from "./ui/skeleton";
import { TimeEntryData } from "@/types";
import { CalendarClock, Edit, List, ListRestart, Rocket, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { EditReferenceObj } from "./time-entry";
import { SelectedData } from "./forms/timelogForm";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";

interface TimeEntries {
  entries: TimeEntryData;
  status: number;
  deleteHandler: (id: number) => void;
  editHandler: (obj: SelectedData, id: number) => void;
  edit: EditReferenceObj;
}

export const TimeEntriesList = ({ entries, status, deleteHandler, editHandler, edit }: TimeEntries) => {
  const renderEntries = Array.isArray(entries.projectsLog) ? (
    entries.projectsLog.map((entryData) => (
      <li key={entryData.project.id} className="px-2">
        {/* project name  */}
        <Card className="overflow-hidden shadow-none">
          <div className="flex w-full justify-between bg-background p-4">
            <p className="flex gap-x-1 font-medium">
              {entryData?.project?.name} - <span>{entryData?.project.client?.name}</span>
            </p>
            <span className="normal-nums">{entryData?.total.toFixed(2)} h</span>
          </div>
          <Separator />
          {/* milestone data */}
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
              <>
                <div className="group relative flex justify-between bg-secondary px-4 py-2.5 last:mb-0" key={i}>
                  <div className="flex flex-col justify-between gap-y-4">
                    <div className="flex gap-x-4">
                      {data.milestone?.name && (
                        <p className="flex items-center gap-1.5 gap-x-1 font-medium">
                          <Rocket className="text-primary" size={18} />
                          {data.milestone.name}
                        </p>
                      )}
                      {data.task?.name && (
                        <p className="flex gap-x-1 font-medium">
                          <List className="text-primary" />
                          {data.task.name}
                        </p>
                      )}
                    </div>
                    <p>{data?.comments}</p>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="font-semibold normal-nums">{data?.time.toFixed(2)} h</span>
                    {/* Billing Status */}
                    {data?.billable ? (
                      <span className="text-sm text-success">Billable</span>
                    ) : (
                      <span className="text-sm">Non-Billable</span>
                    )}
                    <div className="mt-2 flex justify-end gap-x-2 md:invisible md:group-hover:visible">
                      <Button size="icon" variant="outline" onClick={() => editHandler(tempObj, data.id)}>
                        {edit.isEditing ? <ListRestart size={16} /> : <Edit size={16} />}
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => deleteHandler(data.id)}>
                        <Trash size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
                {i !== entryData?.data.length - 1 && <Separator />}
              </>
            );
          })}
        </Card>
      </li>
    ))
  ) : (
    <li className="flex flex-col items-center justify-center space-y-2 p-12">
      <CalendarClock className="h-8 w-8" />
      <h2 className="text-xl font-bold">No Timesheet Entries</h2>
      <p>You haven&apos;t made any timesheet entries for the selected date.</p>
    </li>
  );

  return (
    <ul className="flex w-full flex-col gap-y-2 overflow-y-auto pb-2">
      {status === 0 ? <Skeleton className="h-20 w-full" /> : status > 0 ? renderEntries : <li>Something went wrong</li>}
    </ul>
  );
};
