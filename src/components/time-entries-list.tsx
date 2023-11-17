import { Skeleton } from "./ui/skeleton";
import { Icons } from "./icons";
import { TimeEntryData } from "@/types";
import { Button } from "./ui/button";
import { EditReferenceObj } from "./time-entry";
import { SelectedData } from "./forms/timelogForm";

interface TimeEntries {
  entries: TimeEntryData;
  status: number;
  deleteHandler: (id: number) => void;
  editHandler: (obj: SelectedData, id: number) => void;
  edit: EditReferenceObj;
}

export const TimeEntriesList = ({ entries, status, deleteHandler, editHandler, edit }: TimeEntries) => {
  return (
    <ul className="flex max-h-60 w-full flex-col gap-y-2 overflow-y-auto">
      {status === 0 ? (
        <Skeleton className="h-20 w-full" />
      ) : status > 0 ? (
        entries.projectsLog?.length ? (
          entries.projectsLog.map(
            (entryData, i) =>
              entryData?.data?.map((data, i) => {
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
                  <li
                    key={i}
                    className="group relative mx-4 mb-2 flex flex-wrap justify-between border-b-2 border-slate-300 bg-background py-5 text-black last:mb-0"
                  >
                    <h3 className="flex w-full items-center gap-x-1 text-foreground">
                      <span className="text-base font-semibold">{entryData?.project?.name}</span>
                      <Icons.dot className="h-5 w-5 text-slate-400" />
                      <span className="text-base font-normal">{entryData?.project.client?.name}</span>
                    </h3>
                    <div className="flex w-full justify-between">
                      <div className="flex gap-x-4 items-center">
                        {data.milestone?.name && (
                          <p className="flex min-w-[90px] justify-center gap-x-[6px] bg-indigo-50 h-auto px-3 py-2 text-xs font-medium rounded-[6px] box-shadow">
                            <Icons.milestone className="text-secondary w-3 h-3" />
                            <span>{data.milestone.name}</span>
                          </p>
                        )}
                        {data.task?.name && (
                          <p className="flex min-w-[90px] justify-center gap-x-[6px] h-auto bg-indigo-50 px-3 py-2 text-xs font-medium rounded-[6px] box-shadow">
                            <Icons.task className="text-secondary w-3 h-3" />
                            <span>{data.task.name}</span>
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-center justify-start gap-y-1">
                        <span className="text-xl font-medium text-foreground">{data?.time.toFixed(2)}</span>
                        <span
                          className={`text-xs font-light capitalize ${
                            data?.billable ? "text-success" : "text-destructive"
                          }`}
                        >
                          {data?.billable ? "billable" : "non billable"}
                        </span>
                      </div>
                    </div>
                    <div className="flex w-full items-start justify-between">
                      <p className="text-sm text-slate-500 line-clamp-1">{data?.comments}</p>
                      <div className="flex gap-x-4 md:invisible md:group-hover:visible justify-center min-w-[68px]">
                        <Button
                          className="h-auto rounded-md border-none p-0"
                          onClick={() => editHandler(tempObj, data.id)}
                        >
                          {edit.isEditing ? <Icons.reset className="h-5 w-5" /> : <Icons.edit className="h-5 w-5" />}
                        </Button>
                        <Button className="h-auto rounded-md border-none p-0" onClick={() => deleteHandler(data.id)}>
                          <Icons.delete className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              }),
          )
        ) : (
          <li className="text-center">Nothing to show</li>
        )
      ) : (
        <li className="text-center">sorry something went wrong</li>
      )}
    </ul>
  );
};
