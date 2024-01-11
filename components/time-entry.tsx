"use client";
import { useState, useEffect, FormEvent } from "react";
import { TimeEntriesList } from "./time-entries-list";
import { InlineDatePicker } from "./inline-date-picker";
import { ClassicDatePicker } from "./date-picker";
import { TimeLogForm } from "./forms/timelogForm";
import { Project } from "types";
import { TimeEntryDataObj } from "types";
import dayjs from "dayjs";
import { toast } from "sonner";
import { SelectedData } from "./forms/timelogForm";

interface TimeEntryProps {
  team: string;
  projects: Project[];
}

export interface EditReferenceObj {
  obj: SelectedData | {};
  isEditing: boolean;
  id: number;
}

export const getDateStr = (date: Date) =>
  date?.toLocaleDateString("en-us", { day: "2-digit", month: "short", weekday: "short" });

export type EntryData = { data: TimeEntryDataObj; status: number };

export const getDates = (date: Date) => {
  let arr = [],
    i = -2;
  for (i; i < 3; i++) arr.push(dayjs(date).add(i, "day").toDate());
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
    (!dates.find((dateInArr) => entries.data[getDateStr(dateInArr)]) || entries.status === 0) && getApiCall();
  }, [dates]);

  return (
    <div className="w-full">
      <div className="rounded-xl border">
        <div className="flex justify-between gap-2 border-b p-2">
          <ClassicDatePicker date={date} setDate={setDate} />
          <InlineDatePicker date={date} setDate={setDate} dates={dates} setDates={setDates} entries={entries.data} />
        </div>
        <h4 className="flex justify-between px-4 py-2">
          Time logged for the day
          <span className="normal-nums">{entries.data[getDateStr(new Date(date))]?.dayTotal.toFixed(2)}</span>
        </h4>
      </div>
      <TimeLogForm
        team={team}
        projects={projects}
        date={date}
        edit={edit}
        setEdit={setEdit}
        submitHandler={submitHandler}
      />
      <TimeEntriesList
        entries={{
          ...entries.data[getDateStr(new Date(date))],
        }}
        status={entries.status}
        deleteHandler={deleteApiCall}
        editHandler={editHandler}
        edit={edit}
      />
    </div>
  );
};
