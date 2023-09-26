"use client";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";

interface TimeEntriesListProps {
    userId:number;
    team:string;
}

export const TimeEntriesList = ({userId,team}:TimeEntriesListProps)=> {
    //0 = loading, 1 = loaded with success , -1 = failed to fetch
    const [entries,setEntries] = useState({data:[],status:0});
    const getEntries =  fetch( `/api/team/time-entry?team=${team}&date=${new Date()}`,{
            method:"GET",
            headers: {
                "Content-Type": "application/json",
              }
        });
        

    getEntries.then(res=>res.json()).then(res=>setEntries({data:res,status:1})).catch((e)=>setEntries({data:[],status:-1}))
        console.log(entries)
    return (
        <ul className="w-3/5 mx-auto">
            {
               entries?.status === 0 ? 
               <Skeleton className="w-full h-20"/>:
               entries?.status > 0 ?
               <></>:
               <li>
                sorry something went wrong
               </li>
            }
        </ul>
    )
}