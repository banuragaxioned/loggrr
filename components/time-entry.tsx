"use client";

import { useState, useEffect, FormEvent, useMemo, useCallback } from "react";
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
      const response = await fetch(`/api/team/time-entry?team=${team}&date=${date}`);
      const data = await response.json();
      // TODO: refactor this later (if no entries found)
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
    // TODO: Implement a confirmation modal for deleting entry
    const isConfirmed = confirm("Do you want to delete this time entry?");
    if (!isConfirmed) return;

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

  /*
   * submitTimeEntry: The following function will return the time entry of the specified id
   */
  const submitTimeEntry = async (
    e: FormEvent,
    clearForm: Function,
    recentlyUsed: SelectedData[],
    selectedData: SelectedData = {},
  ) => {
    e.preventDefault();
    if (!selectedData) return;
    const { project, milestone, time, comment, billable, task } = selectedData || {};
    const dateToStoreInDB = new Date(date).toISOString().split("T")[0]; // Extracts only the date

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
        const arr =
          recentlyUsed.length < 3 ? [selectedData, ...recentlyUsed] : [selectedData, ...recentlyUsed.slice(0, 1)];
        edit.isEditing ? setEdit((prev) => ({ ...prev, isEditing: false })) : setRecent(arr);
        getTimeEntries();
        clearForm();
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
    }
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
          submitHandler={submitTimeEntry}
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
