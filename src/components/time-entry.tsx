"use client";
import {useState} from "react";
import { TimeEntryForm } from "./forms/timeEntryForm";
import { TimeEntriesList } from "./time-entries-list";
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
        <TimeEntryForm team={team} projects={projects} submitCounter={setSubmitCount}/>
        <TimeEntriesList userId={userId} team={team} submitCount={submitCount}/>
        </>
    )
}