"use client";

import { useState, useEffect, FormEvent, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { format, startOfToday } from "date-fns";
import { CircleDollarSign, Clock, Folder, Info, List, Rocket } from "lucide-react";

import { useTimeEntryState } from "@/store/useTimeEntryStore";

import { TimeEntryDataObj } from "@/types";
import { Project } from "@/types";
import { TimeEntriesList } from "./time-entries-list";
import { InlineDatePicker } from "./inline-date-picker";

import { SelectedData } from "./forms/timelogForm";
import { Card, CardContent, CardHeader } from "./ui/card";
import { TimeLogForm } from "./forms/timelogForm";
import { useRouter } from "next/navigation";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

interface TimeEntryProps {
  team: string;
  projects: Project[];
  recentTimeEntries: any[];
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

/*
 * getDateString: returns date in format Wed, Jan 31
 */
export const getDateString = (date: Date) => {
  return date?.toLocaleDateString("en-us", { day: "2-digit", month: "short", weekday: "short", year: "numeric" });
};

export const TimeEntry = ({ team, projects, recentTimeEntries }: TimeEntryProps) => {
  const router = useRouter();
  const updateTime = useTimeEntryState((state) => state.updateTime);
  const setQuickActionDate = useTimeEntryState((state) => state.setQuickActionDate);
  const resetTimeEntryStates = useTimeEntryState((state) => state.resetTimeEntryStates);
  const [date, setDate] = useState<Date>(startOfToday());
  const [edit, setEdit] = useState<EditReferenceObj>({ obj: {}, isEditing: false, id: null });
  const [entries, setEntries] = useState<EntryData>({ data: {}, status: "loading" });
  const [recent, setRecent] = useState(null);

  // This sets the date to the store which we can utilize for quick action time
  useEffect(() => {
    setQuickActionDate(date);

    return () => {
      resetTimeEntryStates();
    };
  }, [date, setQuickActionDate, resetTimeEntryStates]);

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
      <Card className="sticky top-[73px] col-span-12 overflow-hidden shadow-none sm:col-span-4">
        <CardHeader className="p-4">
          <p className="text-sm font-medium text-muted-foreground">Recently used</p>
        </CardHeader>
        <Separator />
        <CardContent className="max-h-none overflow-y-auto p-0 sm:max-h-[calc(100vh-154px)]">
          {recentTimeEntries.length > 0 ? (
            <ul className="select-none divide-y">
              {recentTimeEntries.map((timeEntry) => {
                return (
                  <li
                    key={timeEntry.id}
                    className="flex cursor-pointer flex-col gap-2 p-4 hover:bg-muted"
                    onClick={() => handleRecentClick(timeEntry)}
                  >
                    <div className="flex items-center gap-2">
                      <Folder size={16} />
                      <span className="text-sm">{timeEntry.project.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Rocket size={16} />
                      <span className="text-sm">{timeEntry.milestone.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <div className={cn("flex items-center gap-2", timeEntry.billable && "text-success")}>
                        <CircleDollarSign size={16} />
                        <span className="text-sm">{timeEntry.billable ? "Billable" : "Non-Billable"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span className="text-sm">{(timeEntry.time / 60).toFixed(2)}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex items-center gap-1.5 p-4 text-sm text-muted-foreground">
              <Info size={16} />
              <span>No time logged in past 7 days</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
