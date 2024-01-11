import { Skeleton } from "./ui/skeleton";
import { TimeEntryData } from "types";
import { CalendarClock, Edit, List, ListRestart, Rocket, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { EditReferenceObj } from "./time-entry";
import { SelectedData } from "./forms/timelogForm";
import { Card } from "./ui/card";

interface TimeEntries {
  entries: TimeEntryData;
  status: number;
  deleteHandler: (id: number) => void;
  editHandler: (obj: SelectedData, id: number) => void;
  edit: EditReferenceObj;
}

export const TimeEntriesList = ({ entries, status, deleteHandler, editHandler, edit }: TimeEntries) => {
  return (
    <ul className="flex w-full flex-col gap-y-2 overflow-y-auto">
      {status === 0 ? (
        <>
          <Skeleton className="h-20 w-full" />
        </>
      ) : status > 0 ? (
        entries.projectsLog?.length ? (
          entries.projectsLog.map((entryData, i) => (
            <li key={i}>
              {/* project name  */}
              <div>
                <div className="flex w-full justify-between bg-background p-4">
                  <h4 className="flex gap-x-1 font-medium">
                    {entryData?.project?.name} - <span>{entryData?.project.client?.name}</span>
                  </h4>
                  <span className="font-bold normal-nums">{entryData?.total.toFixed(2)}</span>
                </div>
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
                    <div
                      className="group relative mb-2 flex justify-between rounded-md bg-secondary p-4 last:mb-0"
                      key={i}
                    >
                      <div className="flex flex-col justify-between gap-y-4">
                        <div className="flex gap-x-4">
                          {data.milestone?.name && (
                            <p className="flex gap-x-1 font-medium">
                              <Rocket className="text-primary" />
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
                      <div className="flex flex-col gap-y-1 text-right">
                        <span className="font-semibold normal-nums">{data?.time.toFixed(2)}</span>
                        {data?.billable && <span className="capitalize text-success">billable</span>}
                        <div className="flex gap-x-2 md:invisible md:group-hover:visible">
                          <Button className="rounded-md p-2" size={"sm"} onClick={() => editHandler(tempObj, data.id)}>
                            {edit.isEditing ? <ListRestart className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                          </Button>
                          <Button className="rounded-md p-2" size={"sm"} onClick={() => deleteHandler(data.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </li>
          ))
        ) : (
          <li>
            <Card className="flex flex-col items-center justify-center space-y-4 p-12">
              <CalendarClock className="h-12 w-12 text-primary" />
              <h2 className="text-2xl font-bold text-primary">No Timesheet Entries</h2>
              <p className="text-primary">You haven&apos;t made any timesheet entries for the selected date.</p>
            </Card>
          </li>
        )
      ) : (
        <li>Sorry something went wrong</li>
      )}
    </ul>
  );
};
