import { Skeleton } from "./ui/skeleton";
import { EntryData } from "./time-entry";
import { Icons } from "./icons";

export const TimeEntriesList = ({ entries }: { entries: EntryData }) => {
  return (
    <ul className="flex max-h-60 w-full flex-col gap-y-2 overflow-y-auto">
      {entries?.status === 0 ? (
        <Skeleton className="h-20 w-full" />
      ) : entries?.status > 0 ? (
        entries?.projectsLog?.length ? (
          entries.projectsLog.map((entryData, i) => (
            <li key={i}>
              {/* project name  */}
              <div>
                <div className="flex w-full justify-between bg-background">
                  <h3 className="flex gap-x-1 font-medium">
                    {entryData?.project?.name} - <span>{entryData?.project.Client?.name}</span>
                  </h3>
                  <span className="text-black text-primary-foreground">{entryData?.total} Hrs</span>
                </div>
                {/* milestone data */}
                {entryData?.data?.map((data, i) => (
                  <div
                    className="mb-2 flex justify-between rounded-md bg-background bg-slate-50 p-4 text-black last:mb-0"
                    key={i}
                  >
                    <div className="flex justify-between flex-col gap-y-4">
                      <div className="flex gap-x-4">
                        {data.milestone?.name && (
                          <p className="flex gap-x-1 font-medium">
                            <Icons.milestone className="text-secondary" />
                            {data.milestone.name}
                          </p>
                        )}
                        {data.task?.name && (
                          <p className="flex gap-x-1 font-medium">
                            <Icons.task className="text-secondary" />
                            {data.task.name}
                          </p>
                        )}
                      </div>
                      <p>{data?.comments}</p>
                    </div>
                    <div className="flex flex-col justify-center gap-y-1 items-center">
                      <span className="font-semibold">{data?.time.toFixed(2)}</span>
                      {data?.billable && <span className="capitalize text-success">billable</span>}
                    </div>
                  </div>
                ))}
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
