"use client";

import { useState, useEffect, FormEvent, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { format, startOfToday } from "date-fns";
import { useRouter } from "next/navigation";

import { useTimeEntryState } from "@/store/useTimeEntryStore";

import { Milestone, Project, TimeEntryDataObj } from "@/types";
import { TimeEntriesList } from "./time-entries-list";
import { InlineDatePicker } from "./inline-date-picker";

import { SelectedData } from "./forms/timelogForm";
import { Card } from "./ui/card";
import { TimeLogForm } from "./forms/timelogForm";
import RecentEntries from "./recent-entries";
import AINotepad from "./notepad-entries";
import TimeCard from "./ai-time-card";
import { Button } from "./ui/button";

export interface RecentEntryProps {
  id: number;
  project?: Project;
  milestone?: Milestone;
  billable?: boolean;
  time?: number;
  comments?: string | null;
}

interface TimeEntryProps {
  team: string;
  projects: Project[];
  recentTimeEntries: RecentEntryProps[];
}

export interface EditReferenceObj {
  obj: SelectedData;
  isEditing: boolean;
  id: number | null;
}

export type EntryData = {
  data: TimeEntryDataObj;
  status: string;
};

export type timecard = {
  projectId: string;
  projectName: string;
  taskId?: string;
  taskName?: string;
  milestoneId: string;
  milestoneName: string;
  time: number; // in minutes
  date: string; // DD-MM-YYYY, this is today's date
  comment: string;
  billable: boolean;
}
type responseArrType = timecard[]

/*
 * getDateString: returns date in format Wed, Jan 31
 */
export const getDateString = (date: Date) => {
  return date?.toLocaleDateString("en-us", { day: "2-digit", month: "short", weekday: "short", year: "numeric" });
};

export const TimeEntry = ({ team, projects, recentTimeEntries }: TimeEntryProps) => {
  const router = useRouter();
  const updateTime = useTimeEntryState((state) => state.updateTime);
  const pageDate = useTimeEntryState((state) => state.date);
  const setQuickActionDate = useTimeEntryState((state) => state.setQuickActionDate);
  const resetTimeEntryStates = useTimeEntryState((state) => state.resetTimeEntryStates);
  const [date, setDate] = useState<Date>(startOfToday());
  const [edit, setEdit] = useState<EditReferenceObj>({ obj: {}, isEditing: false, id: null });
  const [entries, setEntries] = useState<EntryData>({ data: {}, status: "loading" });
  const [recent, setRecent] = useState(null);
  const [isInput, setIsInput] = useState(false)
  const [responseArr, setResponseArr] = useState<responseArrType>([]) // TODO: set to empty array
  const [loading, setLoading] = useState(false);

  // This sets the date to the store which we can utilize for quick action time
  useEffect(() => {
    setQuickActionDate(date);

    return () => {
      resetTimeEntryStates();
    };
  }, [date, setQuickActionDate, resetTimeEntryStates]);

  // This sets the date from the distribution widgets
  useEffect(() => {
    if (pageDate) {
      setDate(pageDate);
    }
  }, [pageDate, setDate]);

  const editEntryHandler = (obj: SelectedData, id: number) => {
    setRecent(null);
    const currentlyEditing = edit.id;
    if (currentlyEditing === id) {
      setEdit({ obj: {}, isEditing: false, id: null });
    } else {
      setEdit({ obj, isEditing: true, id });
    }
  };

  const hoursToDecimal = (val: string) => Number(val.replace(":", "."));

  /*
   * getTimeEntries: The following function will return the time entries of the specified dates
   */
  const getTimeEntries = useCallback(async () => {
    try {
      const response = await fetch(`/api/team/time-entry?team=${team}&date=${getDateString(date)}`);
      const data = await response.json();
      if (Object.keys(data).length > 0) {
        setEntries((prevEntries) => ({ data: { ...prevEntries.data, ...data }, status: "success" }));
      } else {
        setEntries({ data: {}, status: "success" });
      }
    } catch (error) {
      console.error("Error fetching time entries", error);
      setEntries({ data: {}, status: "error" });
    }
  }, [team, date]);

  /*
   * deleteTimeEntry: The following function will return the time entry of the specified id
   */
  const deleteTimeEntry = async (id: number) => {
    try {
      const response = await fetch(`/api/team/time-entry?team=${team}&id=${JSON.stringify(id)}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error(`Failed to delete. Server responded with ${response.status}`);

      getTimeEntries();
      router.refresh();
      toast("Time entry deleted!");
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error deleting time entry", error);
    }
  };

  /*
   * submitTimeEntry: The following function will return the time entry of the specified id
   */
  const submitTimeEntry = async (e: FormEvent, clearForm: Function, selectedData: SelectedData = {}) => {
    e.preventDefault();
    if (!selectedData) return;
    const { project, milestone, time, comment, billable, task } = selectedData || {};
    const dateToStoreInDB = format(date, "yyyy-MM-dd"); // Extracts only the date

    const dataToSend = {
      team,
      project: project?.id,
      milestone: milestone?.id,
      time: Number(hoursToDecimal(time ?? "0")) * 60,
      comments: comment?.trim(),
      billable: billable ? true : false,
      task: task?.id,
      date: dateToStoreInDB,
    };

    try {
      const response = await fetch("/api/team/time-entry", {
        method: `${edit.isEditing ? "PUT" : "POST"}`,
        body: JSON.stringify(edit.isEditing ? { ...dataToSend, id: edit.id } : dataToSend),
      });
      if (response.ok) {
        toast.success(`${edit.isEditing ? "Updated" : "Added"} time entry in ${project?.name}`);
        edit.isEditing ? setEdit({ obj: {}, isEditing: false, id: null }) : null;
        if (recent) setRecent(null);
        getTimeEntries();
        clearForm();
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.log("Error submitting form!", error);
    }
  };

  useEffect(() => {
    getTimeEntries();
  }, [getTimeEntries, updateTime]);

  const dayTotalTime = useMemo(() => entries.data.dayTotal, [entries.data]);

  /*
   * handleRecentClick: The following function adds recent state for adding new entry
   */
  const handleRecentClick = (selected: any) => {
    setEdit({ obj: {}, isEditing: false, id: null });
    setRecent({ ...selected, comment: selected.comments, time: (selected.time / 60).toFixed(2) });
  };

  const handleInput = async (input: string) => {
    setIsInput(!!input)
    console.log(input)
    // setResponseArr(dummResponse)
    // return
    setLoading(true)
    const response = await fetch('https://ai.webtiara.in/loggrai', {
        method: 'POST',
        body: JSON.stringify({ input }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json();
    console.log(data)
    setResponseArr(data.result)
    setLoading(false)
  }

  const handleaddLog = (timecard: timecard) => {
    // remove from responseArr
    console.log(timecard);
    const newResponseArr = responseArr.filter((res) => res.projectId !== timecard.projectId)
    setResponseArr(newResponseArr)
    toast.success("Task logged successfully!");
  }

  const handleClose = (timecard: timecard) => {
    // remove from responseArr
    console.log(timecard);
    const newResponseArr = responseArr.filter((res) => res.projectId !== timecard.projectId)
    setResponseArr(newResponseArr)
    toast.warning("Task discarded!");
  }

  const handleAddAll = () => {
    // add all to timecard
    setResponseArr([])
    toast.success("All tasks logged successfully!");
  }


  return (
    <div className="grid w-full grid-cols-12 items-start gap-4">
      <Card className="col-span-12 shadow-none sm:col-span-8">
        <div className="flex justify-between gap-2 border-b p-2">
          <InlineDatePicker date={date} setDate={setDate} dayTotalTime={dayTotalTime} />
        </div>
        <TimeLogForm projects={projects} edit={edit} recent={recent} submitHandler={submitTimeEntry} />
        {dayTotalTime && (
          <p className="mb-2 flex justify-between px-5 font-medium">
            Total time logged for the day
            <span className="normal-nums">{dayTotalTime.toFixed(2)} h</span>
          </p>
        )}
        <TimeEntriesList
          entries={entries.data}
          status={entries.status}
          deleteEntryHandler={deleteTimeEntry}
          editEntryHandler={editEntryHandler}
          edit={edit}
        />
      </Card>
      <RecentEntries recentTimeEntries={recentTimeEntries} handleRecentClick={handleRecentClick} />
      <AINotepad getInput={handleInput} loading={loading} />
      <div className="w-[500px] flex flex-col gap-5 ml-auto items-start absolute right-2">
        {responseArr?.map((timecard, index) => {
          return (
            <TimeCard key={index} data={timecard} handleClose={handleClose} handleaddLog={handleaddLog} />
          )
        })}
        {responseArr.length > 0 && <Button onClick={handleAddAll}>Log All</Button>}
      </div>
    </div>
  );
};
