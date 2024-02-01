"use client";

import { useState, useEffect, FormEvent } from "react";
import dayjs from "dayjs";
import { toast } from "sonner";

import { TimeEntryDataObj } from "@/types";
import { Project } from "@/types";
import { TimeEntriesList } from "./time-entries-list";
import { InlineDatePicker } from "./inline-date-picker";
import { ClassicDatePicker } from "./date-picker";

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

export type EntryData = { data: TimeEntryDataObj; status: number };

/**
 * * getDateString: returns date in format Wed, Jan 31
 */
export const getDateString = (date: Date) => {
  return date?.toLocaleDateString("en-us", { day: "2-digit", month: "short", weekday: "short" });
};

/**
 * * getDates: returns dates in array format upto specified dates
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
  const [dates, setDates] = useState<Date[]>(getDates(date));
  const [edit, setEdit] = useState<EditReferenceObj>({ obj: {}, isEditing: false, id: 0 });
  //0 = loading, 1 = loaded with success , -1 = failed to fetch
  const [entries, setEntries] = useState<EntryData>({ data: {}, status: 0 });

  const editHandler = (obj: SelectedData, id: number) => {
    setEdit({ obj, isEditing: edit.isEditing ? false : true, id });
  };

  const hoursToDecimal = (val: string) => Number(val.replace(":", "."));

  const getApiCall = () =>
    fetch(`/api/team/time-entry?team=${team}&dates=${JSON.stringify(dates)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => setEntries({ data: { ...entries.data, ...res }, status: 1 }))
      .catch((e) => setEntries({ data: {}, status: -1 }));

  const deleteApiCall = (id: number) =>
    fetch(`/api/team/time-entry?team=${team}&id=${JSON.stringify(id)}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        getApiCall();
        toast.success("Time entry deleted");
      })
      .catch((e) => toast.error("Something went wrong"));

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
      getApiCall();
    } else toast.error("Something went wrong,try again");
    clearForm();
  };

  useEffect(() => {
    (!dates.find((dateInArr) => entries.data[getDateString(dateInArr)]) || entries.status === 0) && getApiCall();
  }, [dates]);

  const dayTotalTime = entries.data[getDateString(new Date(date))]?.dayTotal.toFixed(2);

  return (
    <div className="w-full">
      <Card className="shadow-none">
        <div className="flex justify-between gap-2 border-b p-2">
          <InlineDatePicker date={date} setDate={setDate} dates={dates} setDates={setDates} entries={entries.data} />
          <ClassicDatePicker date={date} setDate={setDate} />
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
            <span className="normal-nums">{dayTotalTime} h</span>
          </p>
        )}
        <TimeEntriesList
          entries={{
            ...entries.data[getDateString(new Date(date))],
          }}
          status={entries.status}
          deleteHandler={deleteApiCall}
          editHandler={editHandler}
          edit={edit}
        />
      </Card>
    </div>
  );
};
