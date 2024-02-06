"use client";

import { useState, useEffect, FormEvent, useMemo, useCallback } from "react";
import dayjs from "dayjs";
import { toast } from "sonner";

import { TimeEntryDataObj } from "@/types";
import { Project } from "@/types";
import { TimeEntriesList } from "./time-entries-list";
import { InlineDatePicker } from "./inline-date-picker";

import { TimeLogForm } from "./forms/timelogForm";
import { SelectedData } from "./forms/timelogForm";
import { Card } from "./ui/card";

interface TimeEntryProps {
  team: string;
  projects: Project[];
}

export interface EditReferenceObj {
  obj: SelectedData | {};
  isEditing: boolean;
  id: number;
}

export type EntryData = { data: TimeEntryDataObj; status: string };

/*
 * getDateString: returns date in format Wed, Jan 31
 */
export const getDateString = (date: Date) => {
  return date?.toLocaleDateString("en-us", { day: "2-digit", month: "short", weekday: "short", year: "numeric" });
};

/*
 * getDates: returns dates in array format upto specified dates
 */
export const getDates = (date: Date) => {
  const arr = [];

  // Update i to add further dates -1 will show 1 day before and 1 will show 1 day after
  for (let i = 0; i <= 0; i++) {
    arr.push(dayjs(date).add(i, "day").toDate());
  }

  return arr;
};

const setRecent = (arr: SelectedData[]) => localStorage.setItem("loggr-recent", JSON.stringify(arr));

export const TimeEntry = ({ team, projects }: TimeEntryProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [edit, setEdit] = useState<EditReferenceObj>({ obj: {}, isEditing: false, id: 0 });
  const [entries, setEntries] = useState<EntryData>({ data: {}, status: "loading" });

  const editEntryHandler = (obj: SelectedData, id: number) => {
    setEdit({ obj, isEditing: edit.isEditing ? false : true, id });
  };

  const hoursToDecimal = (val: string) => Number(val.replace(":", "."));

  /*
   * getTimeEntries: The following function will return the time entries of the specified dates
   */
  const getTimeEntries = useCallback(async () => {
    try {
      const response = await fetch(`/api/team/time-entry?team=${team}&dates=${JSON.stringify([date])}`);
      const data = await response.json();
      setEntries((prevEntries) => ({ data: { ...prevEntries.data, ...data }, status: "success" }));
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
      toast.success("Time entry deleted");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  //submit handler
  const submitHandler = async (
    e: FormEvent,
    clearForm: Function,
    recentlyUsed: SelectedData[],
    selectedData: SelectedData = {},
  ) => {
    e.preventDefault();
    const defaultBodyObj = {
      team,
      project: selectedData?.project?.id,
      milestone: selectedData?.milestone?.id,
      time: Number(hoursToDecimal(selectedData?.time ? selectedData.time : "0")) * 60,
      comments: selectedData?.comment?.trim(),
      billable: selectedData?.billable ? true : false,
      task: selectedData?.task?.id,
      date: new Date(date),
    };

    const response = await fetch("/api/team/time-entry", {
      method: `${edit.isEditing ? "PUT" : "POST"}`,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(edit.isEditing ? { ...defaultBodyObj, id: edit.id } : defaultBodyObj),
    });
    if (response.ok) {
      toast.success("Entry Updated");
      const arr =
        recentlyUsed.length < 3 ? [selectedData, ...recentlyUsed] : [selectedData, ...recentlyUsed.slice(0, 1)];
      edit.isEditing ? setEdit((prev) => ({ ...prev, isEditing: false })) : setRecent(arr);
      getTimeEntries();
    } else toast.error("Something went wrong,try again");
    clearForm();
  };

  useEffect(() => {
    getTimeEntries();
  }, [getTimeEntries]);

  const dayTotalTime = useMemo(
    () => entries.data[getDateString(new Date(date))]?.projectsLog.reduce((sum, item) => (sum += item.total), 0),
    [entries.data, date],
  );

  return (
    <div className="w-full">
      <Card className="shadow-none">
        <div className="flex justify-between gap-2 border-b p-2">
          <InlineDatePicker date={date} setDate={setDate} dayTotalTime={dayTotalTime} />
        </div>
        <TimeLogForm
          team={team}
          projects={projects}
          date={date}
          edit={edit}
          setEdit={setEdit}
          submitHandler={submitHandler}
        />
        {dayTotalTime && (
          <p className="mb-2 flex justify-between px-5 font-medium">
            Total time logged for the day
            <span className="normal-nums">{dayTotalTime.toFixed(2)} h</span>
          </p>
        )}
        <TimeEntriesList
          entries={{
            ...entries.data[getDateString(new Date(date))],
          }}
          status={entries.status}
          deleteEntryHandler={deleteTimeEntry}
          editEntryHandler={editEntryHandler}
          edit={edit}
        />
      </Card>
    </div>
  );
};
