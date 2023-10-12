"use client";
import {useState,useEffect} from "react";
import { TimeEntryForm } from "./forms/timeEntryForm";
import { TimeEntriesList } from "./time-entries-list";
import { InlineDatePicker } from "./inline-date-picker";
import { ClassicDatePicker } from "./datePicker";
import {TimeLogForm} from "./forms/timelogForm";
import { Project } from "@/types";
import { TimeEntryData } from "@/types";

interface TimeEntryProps {
    team:string;
    projects:Project[];
    userId:number;
}

export type EntryData = { data: TimeEntryData[]; status: number }

export const TimeEntry = ({team,projects,userId}:TimeEntryProps)=> {
    const [submitCount,setSubmitCount] = useState<number>(0);
    const [date,setDate] = useState<Date>(new Date());
    const [dateRangeArr,setDateRangeArr] = useState<Date[]>([])
    //0 = loading, 1 = loaded with success , -1 = failed to fetch
    const [entries, setEntries] = useState<EntryData>({ data: [], status: 0 });
    const getEntries = fetch(`/api/team/time-entry?team=${team}&date=${date}`, {
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
      }, [submitCount,date]);
  
    return (
        <div className="w-11/12 mx-auto">
        <div className="border-slate-300 border-[1px] rounded-xl">
            <div className="p-4 border-b-slate-300 border-b-[1px] flex justify-between">
            <ClassicDatePicker date={date} setDate={setDate}/>
            <InlineDatePicker  date={date} setDate={setDate}/>
            </div>
            <h2 className="flex justify-between px-5 py-2">Time logged for the day <span>0.0</span></h2>
        </div>
        <TimeLogForm team={team} projects={projects} submitCounter={setSubmitCount} date={date}/>
        {/* <TimeEntryForm team={team} projects={projects} submitCounter={setSubmitCount}/> */}
        <TimeEntriesList entries={entries} />
        </div>
    )
}