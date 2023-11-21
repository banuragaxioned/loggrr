import { useState, useEffect, FormEvent, Dispatch } from "react";
import { TimeEntriesList } from "./time-entries-list";
import { InlineDatePicker } from "./inline-date-picker";
import { ClassicDatePicker } from "./datePicker";
import { TimeLogForm } from "./forms/timelogForm";
import { Project, TimeEntryData } from "@/types";
import { TimeEntryDataObj } from "@/types";
import dayjs from "dayjs";
import useToast from "@/hooks/useToast";
import { SelectedData } from "./forms/timelogForm";
import { UserTimeEntry } from "./time-logged";

export interface TimeEntryProps {
  team: string;
  projects: Project[];
  setUserEntry: Dispatch<UserTimeEntry>;
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
    i = -7;
  for (i; i < 8; i++) arr.push(dayjs(date).add(i, "day").toDate());
  return arr;
};

const setRecent = (arr: SelectedData[]) => localStorage.setItem("loggr-recent", JSON.stringify(arr));

export const TimeEntry = ({ team, projects, setUserEntry }: TimeEntryProps) => {
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

  const weekEntryFilter = (res: TimeEntryDataObj): UserTimeEntry => {
    let i = 0,
      med = 6,
      currentWeek: TimeEntryData[] = [];
    for (i; i < 7; i++) {
      const dateObj = res[getDateStr(dates[med - i])];
      dateObj && currentWeek.push(dateObj);
    }
    return currentWeek.reduce(
      (prev: UserTimeEntry, current) => {
        prev.totalTime += current.dayTotal;
        current.projectsLog.map((projectLog) => {
          const index = prev.projects.findIndex((project) => project?.name === projectLog.project.name);
          const availableProject = prev.projects[index];
          availableProject
            ? (prev.projects[index] = {
                ...availableProject,
                timeEntered: availableProject.timeEntered + projectLog.total,
              })
            : prev.projects.push({ name: projectLog.project.name, timeEntered: projectLog.total });
        });
        return prev;
      },
      { totalTime: 0, projects: [] },
    );
  };

  const getApiCall = () =>
    fetch(`/api/team/time-entry?team=${team}&startDate=${JSON.stringify(dates[0])}&endDate=${JSON.stringify(dates[dates.length-1])}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        const datesAsStrs = dates.map((date) => getDateStr(date));
        entries.status === 0 && setUserEntry(weekEntryFilter(res));
        datesAsStrs.map((date) => (res[date] ? res : (res = { ...res, [date]: { dayTotal: 0 } })));
        setEntries({ data: { ...entries.data, ...res }, status: 1 });
      })
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
        showToast("Time entry deleted", "success");
      })
      .catch((e) => showToast("Something went wrong", "error"));

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
      showToast("Entry Updated", "success");
      const arr =
        recentlyUsed.length < 3 ? [selectedData, ...recentlyUsed] : [selectedData, ...recentlyUsed.slice(0, 1)];
      edit.isEditing ? setEdit((prev) => ({ ...prev, isEditing: false })) : setRecent(arr);
      getApiCall();
    } else showToast("Something went wrong,try again", "warning");
    clearForm();
  };

  useEffect(() => {
    (!dates.find((dateInArr) => entries.data[getDateStr(dateInArr)]) || entries.status === 0) && getApiCall();
  }, [dates]);

  return (
    <div className="mx-auto w-[72%]">
      <h2 className="my-2 md:hidden">Add a new entry</h2>
      <div className="rounded-xl border-[1px] border-slate-300">
        <div className="flex flex-col border-b-[1px] border-b-slate-300 px-5 py-4 md:flex-row md:items-center md:gap-x-[9px]">
          <ClassicDatePicker date={date} setDate={setDate} />
          <InlineDatePicker
            date={date}
            setDate={setDate}
            dates={dates.slice(5, 10)}
            setDates={setDates}
            entries={entries.data}
          />
        </div>
        <span className="flex justify-between px-5 py-2 text-lg font-semibold">
          Time logged for the day <span>{entries.data[getDateStr(new Date(date))]?.dayTotal.toFixed(2) || 0}</span>
        </span>
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
