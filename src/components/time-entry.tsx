"use client";
import { useState, useEffect, FormEvent } from "react";
import { TimeEntriesList } from "./time-entries-list";
import { InlineDatePicker } from "./inline-date-picker";
import { ClassicDatePicker } from "./datePicker";
import { TimeLogForm } from "./forms/timelogForm";
import { Project } from "@/types";
import { TimeEntryDataObj } from "@/types";
import dayjs from "dayjs";
import useToast from "@/hooks/useToast";
import { SelectedData } from "./forms/timelogForm";

interface TimeEntryProps {
  team: string;
  projects: Project[];
  userId: number;
}

export interface EditReferenceObj {
  obj: SelectedData | {};
  isEditing: boolean;
  id: number;
}

export const getDateStr = (date: Date) =>
  date.toLocaleDateString("en-us", { day: "2-digit", month: "short", weekday: "short" });

export type EntryData = { data: TimeEntryDataObj; status: number };

export const getDates = (date: Date) => {
  let arr = [],
    i = -2;
  for (i; i < 3; i++) arr.push(dayjs(date).add(i, "day").toDate());
  return arr;
};

export const TimeEntry = ({ team, projects, userId }: TimeEntryProps) => {
  const [submitCount, setSubmitCount] = useState<number>(0);
  const [date, setDate] = useState<Date>(new Date());
  const [dates, setDates] = useState<Date[]>(getDates(date));
  const [edit, setEdit] = useState<EditReferenceObj>({ obj: {}, isEditing: false, id: 0 });
  //0 = loading, 1 = loaded with success , -1 = failed to fetch
  const [entries, setEntries] = useState<EntryData>({ data: {}, status: 0 });
  const showToast = useToast();

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
      .then((res) => setEntries({ data: res, status: 1 }))
      .catch((e) => setEntries({ data: {}, status: -1 }));

  const deleteApiCall = (id: number) =>
    fetch(`/api/team/time-entry?team=${team}&id=${JSON.stringify(id)}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setSubmitCount((prev) => prev++);
        getApiCall();
        showToast("Time entry deleted", "success");
      })
      .catch((e) => showToast("Something went wrong", "error"));

  useEffect(() => {
    getApiCall();
  }, [submitCount, !dates.find((dateInArr) => getDateStr(dateInArr) === getDateStr(date)) || entries.status === 0]);

  //submit handler
  const submitHandler = async (e: FormEvent, clearForm: Function, selectedData?: SelectedData) => {
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
      showToast("Entry Updated", "success");
      setSubmitCount((prev) => prev + 1);
      edit.isEditing && setEdit((prev) => ({ ...prev, isEditing: false }));
    } else showToast("Something went wrong,try again", "warning");
    clearForm();
  };

  useEffect(() => {
    getApiCall();
  }, [submitCount, !dates.find((dateInArr) => getDateStr(dateInArr) === getDateStr(date)) || entries.status === 0]);

  return (
    <div className="mx-auto w-11/12">
      <div className="rounded-xl border-[1px] border-slate-300">
        <div className="flex justify-between border-b-[1px] border-b-slate-300 p-4">
          <ClassicDatePicker date={date} setDate={setDate} />
          <InlineDatePicker date={date} setDate={setDate} dates={dates} setDates={setDates} entries={entries.data} />
        </div>
        <h2 className="flex justify-between px-5 py-2">
          Time logged for the day <span>{entries.data[getDateStr(new Date(date))]?.dayTotal.toFixed(2)}</span>
        </h2>
      </div>
      <TimeLogForm
        team={team}
        projects={projects}
        submitCounter={setSubmitCount}
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
