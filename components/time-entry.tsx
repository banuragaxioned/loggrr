"use client";

import { useState, useEffect, FormEvent, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

import { useTimeEntryState } from "@/store/useTimeEntryStore";

import { Milestone, Project, TimeEntryDataObj } from "@/types";
import { TimeEntriesList } from "./time-entries-list";
import { InlineDatePicker } from "./inline-date-picker";

import { SelectedData } from "./forms/timelogForm";
import { Card } from "./ui/card";
import { TimeLogForm } from "./forms/timelogForm";
import RecentEntries from "./recent-entries";
import AINotepad from "./ai/notepad";
import NotepadResponse from "./ai/notepad-response";
import { hoursToDecimal } from "@/lib/helper";
import { generateId } from "ai";

export interface RecentEntryProps {
  id: number;
  project?: Project;
  milestone?: Milestone | null;
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

/*
 * getDateString: returns date in format Wed, Jan 31
 */
export const getDateString = (date: Date) => {
  return date?.toLocaleDateString("en-us", { day: "2-digit", month: "short", weekday: "short", year: "numeric" });
};

export const TimeEntry = ({ team, projects, recentTimeEntries }: TimeEntryProps) => {
  const router = useRouter();
  const updateTime = useTimeEntryState((state) => state.updateTime);
  const date = useTimeEntryState((state) => state.date);
  const setDate = useTimeEntryState((state) => state.setDate);
  const resetTimeEntryStates = useTimeEntryState((state) => state.resetTimeEntryStates);
  const [edit, setEdit] = useState<EditReferenceObj>({ obj: {}, isEditing: false, id: null });
  const [entries, setEntries] = useState<EntryData>({ data: {}, status: "loading" });
  const [recent, setRecent] = useState(null);
  const [aiInput, setAiInput] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponses, setAiResponses] = useState<Project[]>([]);

  // This sets the AI input from the local storage
  useEffect(() => {
    setAiInput(localStorage?.getItem("notebook-input") || "");

    return () => {
      resetTimeEntryStates();
    };
  }, [resetTimeEntryStates]);

  const editEntryHandler = (obj: SelectedData, id: number) => {
    setRecent(null);
    const currentlyEditing = edit.id;
    if (currentlyEditing === id) {
      setEdit({ obj: {}, isEditing: false, id: null });
    } else {
      setEdit({ obj, isEditing: true, id });
    }
  };

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
      const response = await fetch(`/api/team/time-entry?team=${team}&id=${id}`, {
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
  const submitTimeEntry = async (
    e: FormEvent,
    clearForm: Function | null,
    selectedData?: SelectedData,
    isMultiple?: boolean,
  ) => {
    e.preventDefault();
    if (!selectedData) return;
    const { project, milestone, time, comment, billable, task, uuid } = selectedData || {};
    const dateToStoreInDB = format(date, "yyyy-MM-dd"); // Extracts only the date

    const dataToSend = {
      team,
      project: project?.id,
      milestone: milestone?.id || null,
      time: +hoursToDecimal(time ?? "0") * 60,
      comments: comment?.trim(),
      billable: billable && project?.billable ? true : false,
      task: task?.id || null,
      date: dateToStoreInDB,
    };

    try {
      const response = await fetch("/api/team/time-entry", {
        method: `${edit.isEditing ? "PUT" : "POST"}`,
        body: JSON.stringify(edit.isEditing ? { ...dataToSend, id: edit.id } : dataToSend),
      });

      if (response.ok && !isMultiple) {
        toast.success(`${edit.isEditing ? "Updated" : "Added"} time entry in ${project?.name}`);
        edit.isEditing ? setEdit({ obj: {}, isEditing: false, id: null }) : null;
        if (recent) setRecent(null);
        getTimeEntries();
        clearForm && clearForm();
        if (aiResponses.length <= 1) {
          router.refresh();
        }
        if (aiResponses.length > 0) {
          setAiResponses(aiResponses.filter((response) => response.uuid !== uuid));
        }
      }
    } catch (error) {
      if (!isMultiple) {
        toast.error("Something went wrong!");
        console.error("Error submitting form!", error);
      }
    }
  };

  useEffect(() => {
    if (!edit.isEditing) {
      getTimeEntries();
    }
  }, [getTimeEntries, updateTime, edit.isEditing]);
  

  const dayTotalTime = useMemo(() => entries.data.dayTotal, [entries.data]);

  /*
   * handleRecentClick: The following function adds recent state for adding new entry
   */
  const handleRecentClick = (selected: any) => {
    setEdit({ obj: {}, isEditing: false, id: null });
    setRecent({ ...selected, comment: selected.comments, time: (selected.time / 60).toFixed(2) });
  };

  /*
   * notebookSubmitHandler: The following will send input to API
   */
  const notebookSubmitHandler = async (input: string) => {
    const userInput = input.trim();
    if (!userInput) return;

    try {
      setAiLoading(true);
      const response = await fetch("/api/team/ai", {
        method: "POST",
        body: JSON.stringify({
          projects: projects,
          input: userInput,
        }),
      });
      const data = await response.json();
      const updatedAiResponse = data.result.data?.map((response: any) => {
        const updatedResponse = {
          ...response,
          uuid: generateId(),
          project: projects
            .map((project) => ({ id: project.id, name: project.name, billable: project.billable }))
            .find((project) => project.id === response.id),
          comment: response.comments,
        };

        return updatedResponse;
      });

      setAiResponses(updatedAiResponse);
    } catch (error) {
      console.error("Error fetching AI response", error);
    } finally {
      setAiLoading(false);
    }
  };

  const submitAllTimeEntries = async (e: FormEvent, allAiEntries: SelectedData[]) => {
    try {
      for (const entry of allAiEntries) {
        const isDataValidated = () => {
          const { project, comment, time } = entry || {};
          return project && comment?.trim().length && time && +time;
        };

        if (isDataValidated()) {
          setAiResponses((prev) => prev.filter((response) => response.uuid !== entry.uuid));
          await submitTimeEntry(e, null, entry, true);
        }
      }
      toast.success("All valid time entries added!");
      getTimeEntries();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error submitting all time entries", error);
    }
  };

  return (
    <div className="grid w-full grid-cols-12 items-start gap-4">
      <Card className="col-span-12 overflow-hidden shadow-none md:col-span-8">
        <div className="flex justify-between gap-2 border-b p-2">
          <InlineDatePicker date={date} setDate={setDate} dayTotalTime={dayTotalTime} />
        </div>
        <TimeLogForm projects={projects} edit={edit} recent={recent} submitHandler={submitTimeEntry} />
        {dayTotalTime && (
          <p className="mb-2 flex items-center justify-between px-5 font-medium">
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
      <div className="col-span-12 flex flex-col gap-4 md:col-span-4">
        <RecentEntries recentTimeEntries={recentTimeEntries} handleRecentClick={handleRecentClick} />
        <AINotepad
          notebookSubmitHandler={notebookSubmitHandler}
          aiInput={aiInput}
          setAiInput={setAiInput}
          aiLoading={aiLoading}
        />
        <NotepadResponse
          aiResponses={aiResponses}
          setAiResponses={setAiResponses}
          projects={projects}
          handleSubmit={submitTimeEntry}
          handleSubmitAll={submitAllTimeEntries}
        />
      </div>
    </div>
  );
};
