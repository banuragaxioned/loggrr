"use client";

import { useState, useEffect, FormEvent, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";

import { Milestone, Project, TimeEntryDataObj } from "@/types";
import { TimeEntriesList } from "./time-entries-list";
import { InlineDatePicker } from "./inline-date-picker";

import { SelectedData } from "./forms/timelogForm";
import { Card } from "./ui/card";
import { TimeLogForm } from "./forms/timelogForm";
import { TimeLogBoard } from "./forms/timelog-board";
import RecentEntries from "./recent-entries";
import { useGlobalState, useGlobalStateHydrated } from "@/store/useGlobalStore";
import { LayoutGrid, Rows3, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import AINotepad from "./ai/notepad";
import NotepadResponse from "./ai/notepad-response";
import { hoursToDecimal } from "@/lib/helper";
import { generateId } from "ai";
import { isTimelogValid } from "@/lib/timelog-validation";

// Shared config for the Classic/Board view switcher (icon toggle in the logger card header)
const VIEW_TOGGLE_ACTIVE = "bg-zinc-200 font-medium text-zinc-900 dark:bg-zinc-700 dark:text-zinc-50";
const VIEW_TOGGLE_INACTIVE = "text-muted-foreground hover:bg-muted";

const LOGGER_VIEWS = [
  { board: false, label: "Classic Timesheet", Icon: Rows3, isNew: false },
  { board: true, label: "New Timesheet", Icon: LayoutGrid, isNew: true },
] as const;

export interface RecentEntryProps {
  id: number;
  project?: Project;
  milestone?: Milestone | null;
  task?: Milestone | null;
  billable?: boolean;
  time?: number;
  comments?: string | null;
}

interface TimeEntryProps {
  team: string;
  projects: Project[];
  recentTimeEntries: RecentEntryProps[];
  initialDate: Date;
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

export const TimeEntry = ({ team, projects, recentTimeEntries, initialDate }: TimeEntryProps) => {
  const router = useRouter();
  const [date, setDate] = useQueryState("date", {
    parse: (value: string) => new Date(value),
    serialize: (date: Date) => format(date, "yyyy-MM-dd"),
    defaultValue: initialDate,
  });
  const [edit, setEdit] = useState<EditReferenceObj>({ obj: {}, isEditing: false, id: null });
  const [entries, setEntries] = useState<EntryData>({ data: {}, status: "loading" });
  const [recent, setRecent] = useState<SelectedData | null>(null);
  // Shared in-progress draft so values persist when switching Classic <-> Board views
  const [draft, setDraft] = useState<SelectedData>({});
  const [aiInput, setAiInput] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponses, setAiResponses] = useState<Project[]>([]);
  const logBoardView = useGlobalState((state) => state.logBoardView);
  const setLogBoardView = useGlobalState((state) => state.setLogBoardView);
  const hasHydrated = useGlobalStateHydrated();
  // Wait for persist rehydration so we don't flash classic → board (or vice versa).
  const showBoard = hasHydrated && logBoardView;

  useEffect(() => {
    setTimeout(() => {
      setAiInput(localStorage?.getItem("notebook-input") || "");
    }, 0);
  }, []);

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
      setTimeout(() => {
        getTimeEntries();
      }, 0);
    }
  }, [getTimeEntries, edit.isEditing]);

  const dayTotalTime = useMemo(() => entries.data.dayTotal, [entries.data]);

  /*
   * handleRecentClick: The following function adds recent state for adding new entry
   */
  const handleRecentClick = (selected: RecentEntryProps) => {
    setEdit({ obj: {}, isEditing: false, id: null });
    setRecent({ ...selected, comment: selected.comments, time: ((selected.time ?? 0) / 60).toFixed(2) });
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
      if (!response.ok || !data?.result?.data) {
        console.error("Error fetching AI response", data?.message ?? data);
        toast.error(data?.message || "Couldn't process that request. Please try again.");
        return;
      }
      const updatedAiResponse = data.result.data.map((response: any) => {
        const updatedResponse = {
          ...response,
          uuid: generateId(),
          // schema returns time as a number; the notepad input expects a string
          time: response.time != null ? String(response.time) : "",
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
        const found = projects.find((project) => project.id === entry.project?.id);
        const isDataValidated = isTimelogValid({
          ...entry,
          categories: found?.milestone ?? [],
          tasks: found?.task ?? [],
        });

        if (isDataValidated) {
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
      <div className="col-span-12 md:col-span-8">
        <Card className="overflow-hidden shadow-none">
          <div className="flex items-center gap-2 border-b p-2">
            {/* View switcher — sits in the card header so it never clips outside the content box */}
            <div
              role="group"
              aria-label="Logger view"
              className={cn(
                "bg-background flex shrink-0 items-center gap-0.5 rounded-md border p-0.5",
                !hasHydrated && "pointer-events-none opacity-60",
              )}
            >
              {LOGGER_VIEWS.map(({ board, label, Icon, isNew }) => (
                <Tooltip key={label}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => setLogBoardView(board)}
                      aria-label={label}
                      aria-pressed={hasHydrated ? showBoard === board : undefined}
                      disabled={!hasHydrated}
                      className={cn(
                        "relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm transition-colors disabled:cursor-default",
                        hasHydrated && showBoard === board ? VIEW_TOGGLE_ACTIVE : VIEW_TOGGLE_INACTIVE,
                      )}
                    >
                      <Icon size={16} />
                      {isNew && (
                        <span className="bg-brand-fuchsia absolute -top-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full text-white">
                          <Sparkles size={8} />
                        </span>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{label}</TooltipContent>
                </Tooltip>
              ))}
            </div>
            <div className="min-w-0 flex-1">
              <InlineDatePicker
                date={date}
                setDate={(newDate: Date) => {
                  router.push(`?date=${format(newDate, "yyyy-MM-dd")}`);
                }}
                dayTotalTime={dayTotalTime}
              />
            </div>
          </div>
          {!hasHydrated ? (
            <div className="bg-muted/40 min-h-70 animate-pulse" aria-hidden />
          ) : showBoard ? (
            <TimeLogBoard
              projects={projects}
              edit={edit}
              recent={recent}
              submitHandler={submitTimeEntry}
              draft={draft}
              onDraftChange={setDraft}
            />
          ) : (
            <TimeLogForm
              projects={projects}
              edit={edit}
              recent={recent}
              submitHandler={submitTimeEntry}
              draft={draft}
              onDraftChange={setDraft}
            />
          )}
          {!!dayTotalTime && (
            <div className="border-border flex items-center justify-between gap-3 border-t px-4 py-2.5 sm:px-5">
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Day total</p>
              <span className="text-sm font-semibold tabular-nums">{dayTotalTime.toFixed(2)} h</span>
            </div>
          )}
          <TimeEntriesList
            entries={entries.data}
            status={entries.status}
            deleteEntryHandler={deleteTimeEntry}
            editEntryHandler={editEntryHandler}
            edit={edit}
          />
        </Card>
      </div>
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
