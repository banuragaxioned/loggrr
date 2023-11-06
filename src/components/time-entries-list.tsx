import { Skeleton } from "./ui/skeleton";
import { Icons } from "./icons";
import { TimeEntryData} from "@/types";
import { Button } from "./ui/button";
import { EditReferenceObj } from "./time-entry";
import { SelectedData } from "./forms/timelogForm";

interface TimeEntries {
  entries: TimeEntryData;
  status: number;
  deleteHandler:(id:number)=>void;
  editHandler:(obj:SelectedData,id:number)=>void,
  edit:EditReferenceObj
}

export const TimeEntriesList = ({ entries, status,deleteHandler,editHandler,edit }: TimeEntries) => {
  return (
    <ul className="flex max-h-60 w-full flex-col gap-y-2 overflow-y-auto">
      {status === 0 ? (
        <Skeleton className="h-20 w-full" />
      ) : status > 0 ? (
        entries.projectsLog?.length ? (
          entries.projectsLog.map((entryData, i) => (
            <li key={i}>
              {/* project name  */}
              <div>
                <div className="flex w-full justify-between bg-background p-4">
                  <h3 className="flex gap-x-1 items-center text-foreground">
                    <span className="text-base font-semibold">{entryData?.project?.name}</span> <Icons.dot className="w-5 h-5 text-slate-400"/> <span className="text-base font-normal">{entryData?.project.client?.name}</span>
                  </h3>
                  <span className="text-black font-bold text-primary-foreground">{entryData?.total.toFixed(2)} Hrs</span>
                </div>
                {/* milestone data */}
                {entryData?.data?.map((data, i) => {
                  const projectObj = {id:entryData.project.id,name:entryData.project.name,billable:entryData.project.billable}
                  const tempObj = {
                    ...data,
                    comment:data.comments,
                    client: entryData.project.client,
                    project: projectObj,
                    time: `${data.time}`,
                  };
                  return (
                    <div
                    className="relative group mb-2 flex justify-between bg-background border-b-2 border-slate-300 py-5 mx-4 text-black last:mb-0"
                    key={i}
                  >
                    <div className="flex flex-col justify-between gap-y-4">
                      <div className="flex gap-x-4">
                        {data.milestone?.name && (
                          <p className="flex gap-x-1 font-medium bg-indigo-50 py-2 px-3 text-xs items-center">
                            <Icons.milestone className="text-secondary" />
                            {data.milestone.name}
                          </p>
                        )}
                        {data.task?.name && (
                          <p className="flex gap-x-1 font-medium bg-indigo-50 py-2 px-3 text-xs items-center">
                            <Icons.task className="text-secondary" />
                            {data.task.name}
                          </p>
                        )}
                      </div>
                      <p className="text-sm px-2 text-foreground">{data?.comments}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-y-1">
                      <span className="font-medium text-xl text-foreground">{data?.time.toFixed(2)}</span>
                       <span className={`capitalize text-xs font-light ${data?.billable ?"text-success":"text-destructive" }`}>billable</span>
                      <div className="flex gap-x-2 md:invisible md:group-hover:visible">
                        <Button className="rounded-md p-2" onClick={()=>editHandler(tempObj,data.id)}>
                        {edit.isEditing ? <Icons.reset className="w-4 h-4"/> :<Icons.edit className="w-4 h-4"/> }
                        </Button>
                        <Button className="rounded-md p-2" onClick={()=>deleteHandler(data.id)}>
                          <Icons.delete className="w-4 h-4"/>
                        </Button>
                      </div>
                    </div>
                  </div>
                  )
                })}
              </div>
            </li>
          ))
        ) : (
          <li>Nothing to show</li>
        )
      ) : (
        <li>sorry something went wrong</li>
      )}
    </ul>
  );
};
