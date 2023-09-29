"use client";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { TimeEntryData } from "@/types";

interface TimeEntriesListProps {
  userId: number;
  team: string;
}

export const TimeEntriesList = ({ userId, team }: TimeEntriesListProps) => {
  //0 = loading, 1 = loaded with success , -1 = failed to fetch
  const [entries, setEntries] = useState<{ data: TimeEntryData[]; status: number }>({ data: [], status: 0 });
  const getEntries = fetch(`/api/team/time-entry?team=${team}&date=${new Date()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    getEntries
      .then((res) => res.json())
      .then((res) => setEntries({ data: res, status: 1 }))
      .catch((e) => setEntries({ data: [], status: -1 }));
  }, []);

  return (
    <div className="mx-auto flex w-3/5 flex-col gap-y-4">
      <h3 className="flex justify-between">Total Logged Hours <span>{entries?.data?.reduce((total,obj)=>total+obj?.total,0)} Hrs</span></h3>
      <ul className="flex w-full flex-col gap-y-2">
        {entries?.status === 0 ? (
          <Skeleton className="h-20 w-full" />
        ) : entries?.status > 0 ? (
          entries?.data?.length ? (
            entries.data.map((entryData, i) => (
              <li key={i}>
                {/* project name  */}
                <div>
                  <div className="flex w-full justify-between">
                    <h4 className="font-medium">{entryData?.project?.name}</h4>
                    <span>{entryData?.total}Hrs</span>
                  </div>
                  {/* milestone data */}
                  {entryData?.data?.map((data, i) => (
                    <div className="rounded-md bg-slate-50 p-4 mb-2 last:mb-0" key={i}>
                      <div className="flex justify-between">
                        <p className="font-medium">{data?.milestone?.name}</p>
                        <span>{data?.billable ? "billable" : "non-billable"}</span>
                      </div>
                      <div className="flex justify-between">
                        <p>{data?.comments}</p>
                        <span>{data?.time.toFixed(2)}</span>
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
    </div>
  );
};
