"use client";
import { useState } from "react";

interface TimeEntriesListProps {
    userId:number;
    team:string;
}

export const TimeEntriesList = ({userId,team}:TimeEntriesListProps)=> {

    const [entries,setEntries] = useState([]);
    const getEntries =  fetch( `/api/team/time-entry?userId=${userId},team=${team}`,{
        method:"GET",
        headers: {
            "Content-Type": "application/json",
          }
    });

    getEntries.then(res=>console.log(res))


    return (
        <ul>
            {
                entries.map(entry=>(<li>
                    {entry}
                </li>))
            }
        </ul>
    )
}