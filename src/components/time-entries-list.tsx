"use client";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

interface TimeEntriesListProps {
    userId:number;
    team:string;
}

export const TimeEntriesList = ({userId,team}:TimeEntriesListProps)=> {
    //0 = loading, 1 = loaded with success , -1 = failed to fetch
    const [entries,setEntries] = useState<{data:any,status:number}>({data:[],status:0});
    const getEntries =  fetch( `/api/team/time-entry?team=${team}&date=${new Date()}`,{
            method:"GET",
            headers: {
                "Content-Type": "application/json",
              }
        });
        

   useEffect(()=>{
    getEntries.then(res=>res.json()).then(res=>setEntries({data:res,status:1})).catch((e)=>setEntries({data:[],status:-1}))
   },[])
        console.log(entries)
    return (
        <div  className="w-3/5 flex flex-col gap-y-4 mx-auto">
            <h3>Total Logged Hours</h3>
            <ul className="w-full flex flex-col gap-y-2">
                {
                    entries?.status === 0 ? 
                <Skeleton className="w-full h-20"/>:
                entries?.status > 0 ?
                entries.data.map((entryData:any)=>(
                    <li>
                        <div>
                            <div><h4>{entryData?.Project.name}</h4><span>{}</span></div>
                            <div className="bg-slate-50 rounded-md p-4">
                                <div className="flex justify-between">
                                    <p className="font-medium">{entryData?.Milestone?.name}</p>
                                    <span>{entryData?.billable ? 'billable':'non-billable'}</span>
                                </div>
                                <div className="flex justify-between">
                                <p>{entryData?.comments}</p>
                                <span>{entryData?.time.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </li>
                )):
                <li>
                    sorry something went wrong
                </li>
                }
            </ul>
    </div>
    )
}