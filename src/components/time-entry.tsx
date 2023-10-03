"use client";
import {useState} from "react";
import { TimeEntryForm } from "./forms/timeEntryForm";
import { TimeEntriesList } from "./time-entries-list";
import { InlineDatePicker } from "./inline-date-picker";
import { ClassicDatePicker } from "./datePicker";
import {TimeLogForm} from "./forms/timelogForm";
import { Project } from "@/types";

interface TimeEntryProps {
    team:string;
    projects:Project[];
    userId:number;
}

export const TimeEntry = ({team,projects,userId}:TimeEntryProps)=> {
    const [submitCount,setSubmitCount] = useState<number>(0);
    return (
        <>
        <div className="border-slate-300 rounded-sm ">
            <div className="p-4 border-b-slate-300 flex justify-between">
            <ClassicDatePicker />
            <InlineDatePicker  />
            </div>
            <h2 className="flex justify-between px-5 py-2">Time logged for the day <span>0.0</span></h2>
        </div>
        <TimeLogForm team={team} projects={projects} submitCounter={setSubmitCount}/>
        {/* <TimeEntryForm team={team} projects={projects} submitCounter={setSubmitCount}/> */}
        <TimeEntriesList userId={userId} team={team} submitCount={submitCount}/>
        </>
    )
}