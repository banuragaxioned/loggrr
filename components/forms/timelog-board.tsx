"use client";

import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  CircleDollarSign,
  Folder,
  List,
  ListRestart,
  MessageSquare,
  Milestone as CategoryIcon,
  Minus,
  Plus,
  Search,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Project, Milestone } from "@/types";
import { EditReferenceObj } from "../time-entry";
import { cn } from "@/lib/utils";
import { hoursToDecimal } from "@/lib/helper";
import {
  isCategoryRequired,
  isClassificationRequired,
  isTaskRequired,
  isTimelogValid,
  mergeSelectedIntoOptions,
} from "@/lib/timelog-validation";
import { RequiredAsterisk } from "@/components/required-asterisk";

import type { SelectedData } from "./timelogForm";

interface TimelogBoardProps {
  projects: Project[];
  edit: EditReferenceObj;
  submitHandler: (e: FormEvent, clearForm: Function, selectedData?: SelectedData) => void;
  recent: any;
  draft?: SelectedData;
  onDraftChange?: (draft: SelectedData) => void;
}

type ErrorsObj = {
  time?: boolean;
};

type ClientGroup = {
  clientId: number | string;
  clientName: string;
  projects: Project[];
};

const initialDataState: SelectedData = {
  client: undefined,
  project: undefined,
  milestone: null,
  task: null,
  comment: "",
  time: "",
  billable: false,
};

const TIME_CHIPS = [
  { id: 1, title: "+15m", incrementBy: 0.25 },
  { id: 2, title: "+30m", incrementBy: 0.5 },
  { id: 3, title: "+1h", incrementBy: 1 },
];

export const TimeLogBoard = ({
  projects,
  edit,
  submitHandler,
  recent,
  draft,
  onDraftChange,
}: TimelogBoardProps) => {
  const [selectedData, setSelectedData] = useState<SelectedData>(initialDataState);
  const [projectMilestones, setProjectMilestones] = useState<Milestone[]>([]);
  const [projectTasks, setprojectTasks] = useState<Milestone[]>([]);
  const [errors, setErrors] = useState<ErrorsObj>({});
  const [projectQuery, setProjectQuery] = useState("");
  const [projectSearchOpen, setProjectSearchOpen] = useState(false);
  const [categoryQuery, setCategoryQuery] = useState("");
  const [categorySearchOpen, setCategorySearchOpen] = useState(false);
  const [taskQuery, setTaskQuery] = useState("");
  const [taskSearchOpen, setTaskSearchOpen] = useState(false);

  const resetSearches = () => {
    setProjectQuery("");
    setProjectSearchOpen(false);
    setCategoryQuery("");
    setCategorySearchOpen(false);
    setTaskQuery("");
    setTaskSearchOpen(false);
  };

  const handleClearForm = () => {
    setSelectedData(initialDataState);
    setProjectMilestones([]);
    setprojectTasks([]);
    setErrors({});
    resetSearches();
  };

  const formValidator = () =>
    isTimelogValid({
      ...selectedData,
      categories: projectMilestones,
      tasks: projectTasks,
      timeError: errors?.time,
    });

  const handleLoggedTimeInput = (time: string) => {
    const numberPattern = new RegExp(/^([1-9]\d*(\.|\:)\d{0,2}|0?(\.|\:)\d*[1-9]\d{0,2}|[1-9]\d{0,2})$/, "g");
    numberPattern.test(time) ? setErrors({ ...errors, time: false }) : setErrors({ ...errors, time: true });
    setSelectedData({ ...selectedData, time: time });
  };

  // Parse the current field value (accepts "1.5" or "1:30") into decimal hours
  const currentHours = () => {
    const value = +hoursToDecimal(selectedData.time || "0");
    return isNaN(value) ? 0 : value;
  };

  // Format decimal hours back into clock time, e.g. 1.5 -> "1:30", 0.25 -> "0:15"
  const hoursToClock = (decimal: number) => {
    const totalMinutes = Math.round(decimal * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}:${m.toString().padStart(2, "0")}`;
  };

  const commitTime = (next: number) => {
    const value = Math.max(next, 0);
    setSelectedData({ ...selectedData, time: value > 0 ? hoursToClock(value) : "" });
    setErrors({ ...errors, time: value <= 0 });
  };

  /*
   * handleTimeChip: literally add a chunk of time (used by the +15m/+30m/+1h chips)
   */
  const handleTimeChip = (timeVariation: number) => commitTime(currentHours() + timeVariation);

  /*
   * handleTimeStep: round to the NEXT (increase) or PREVIOUS (decrease) 30-min boundary.
   * e.g. 1:15 + -> 1:30, 1:15 - -> 1:00. Already on a boundary -> full 30-min step.
   */
  const STEP = 0.5;
  const handleTimeStep = (action: "increase" | "decrease") => {
    const units = currentHours() / STEP;
    const next =
      action === "increase" ? (Math.floor(units + 1e-9) + 1) * STEP : (Math.ceil(units - 1e-9) - 1) * STEP;
    commitTime(next);
  };

  /*
   * projectCallback: called when a project card is clicked
   */
  const projectCallback = (selected: Project) => {
    setSelectedData((prev) => ({
      ...prev,
      client: selected?.client,
      project: { id: selected.id, name: selected?.name, billable: selected?.billable },
      // reset the downstream selections whenever a different project is picked
      milestone: selected.id !== prev.project?.id ? undefined : prev.milestone,
      task: selected.id !== prev.project?.id ? undefined : prev.task,
      billable: selected?.billable ? true : false,
    }));
    setProjectMilestones(selected?.milestone ?? []);
    setprojectTasks(selected?.task ?? []);
    // clear any open category/task search when switching projects
    setCategoryQuery("");
    setCategorySearchOpen(false);
    setTaskQuery("");
    setTaskSearchOpen(false);
  };

  /*
   * milestoneCallback / taskCallback: clicking an active chip clears it when optional.
   * When classification is required, allow clear only if the other side still satisfies it.
   */
  const milestoneCallback = (selected: Milestone) =>
    setSelectedData((prev) => {
      if (prev.milestone?.id === selected.id) {
        const mustKeep =
          isClassificationRequired(prev.project, projectMilestones, projectTasks) && !prev.task?.id;
        if (mustKeep) return prev;
        return { ...prev, milestone: null };
      }
      return { ...prev, milestone: selected };
    });

  const taskCallback = (selected: Milestone) =>
    setSelectedData((prev) => {
      if (prev.task?.id === selected.id) {
        const mustKeep =
          isClassificationRequired(prev.project, projectMilestones, projectTasks) && !prev.milestone?.id;
        if (mustKeep) return prev;
        return { ...prev, task: null };
      }
      return { ...prev, task: selected };
    });

  const setCommentText = (str: string) => setSelectedData({ ...selectedData, comment: str });

  // Seed local state from a SelectedData snapshot, deriving the project's category/task lists.
  // Inject archived (or otherwise missing) selections so edit flows stay valid.
  const seedState = (data?: SelectedData | null) => {
    const found = projects.find((project) => project.id === data?.project?.id);
    const nextData =
      data && Object.keys(data).length
        ? {
            ...data,
            project: data.project
              ? { ...data.project, billable: data.project.billable ?? found?.billable }
              : data.project,
          }
        : initialDataState;
    setSelectedData(nextData);
    setProjectMilestones(mergeSelectedIntoOptions(found?.milestone ?? [], data?.milestone));
    setprojectTasks(mergeSelectedIntoOptions(found?.task ?? [], data?.task));
    setErrors({});
  };

  // Latest shared draft, read on mount/switch without re-running the effect on every keystroke
  const draftRef = useRef(draft);
  draftRef.current = draft;

  // Keep the board in sync with edit / recent quick-fill; otherwise seed from the shared draft
  useEffect(() => {
    if (edit.isEditing) {
      seedState(edit.obj);
    } else if (recent) {
      seedState(recent);
    } else {
      seedState(draftRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edit, projects, recent]);

  // Report the live draft up so the other view can pick it up (skip while editing/quick-fill)
  useEffect(() => {
    if (!edit.isEditing && !recent) onDraftChange?.(selectedData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedData, edit.isEditing, recent]);

  // Group projects by client, then filter by the search box (mirrors ComboBox grouping)
  const groupedProjects = useMemo<ClientGroup[]>(() => {
    const query = projectQuery.trim().toLowerCase();
    const grouped = Object.values(
      projects.reduce((acc: Record<string, ClientGroup>, project) => {
        const clientId = project.client?.id ?? "no-client";
        const clientName = project.client?.name ?? "Other";
        if (!acc[clientId]) acc[clientId] = { clientId, clientName, projects: [] };
        acc[clientId].projects.push(project);
        return acc;
      }, {}),
    ).sort((a, b) => a.clientName.localeCompare(b.clientName));

    if (!query) return grouped;
    return grouped
      .map((group) => ({
        ...group,
        projects: group.projects.filter(
          (project) =>
            project.name?.toLowerCase().includes(query) || group.clientName.toLowerCase().includes(query),
        ),
      }))
      .filter((group) => group.projects.length > 0);
  }, [projects, projectQuery]);

  const isProjectSelected = !!selectedData?.project?.id;
  const hasSelection = selectedData?.project || selectedData?.task || selectedData?.milestone;

  const filterByName = (items: Milestone[], query: string) => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((item) => item.name?.toLowerCase().includes(q)) : items;
  };
  const filteredMilestones = useMemo(
    () => filterByName(projectMilestones, categoryQuery),
    [projectMilestones, categoryQuery],
  );
  const filteredTasks = useMemo(() => filterByName(projectTasks, taskQuery), [projectTasks, taskQuery]);
  const categoryRequired = isCategoryRequired(
    selectedData.project,
    projectMilestones,
    projectTasks,
    selectedData.milestone,
    selectedData.task,
  );
  const taskRequired = isTaskRequired(
    selectedData.project,
    projectTasks,
    projectMilestones,
    selectedData.milestone,
    selectedData.task,
  );
  const categoryMissing = categoryRequired;
  const taskMissing = taskRequired;
  const showCategories = projectMilestones.length > 0;
  const showTasks = projectTasks.length > 0;
  const boardColumnCount = 1 + Number(showCategories) + Number(showTasks);
  // Cap list height so long lists scroll; short lists shrink to content (no empty whitespace).
  const columnListClass = "max-h-[280px] overflow-y-auto";

  return (
    <div>
      {/* Cascading columns: Project -> Category/Task when the selected project has them.
          No top border here — the parent card header already provides one. */}
      <div
        className={cn(
          "grid grid-cols-1 divide-y sm:divide-x sm:divide-y-0",
          boardColumnCount === 1 && "sm:grid-cols-1",
          boardColumnCount === 2 && "sm:grid-cols-2",
          boardColumnCount === 3 && "sm:grid-cols-3",
        )}
      >
        {/* Column 1: Projects (grouped by client) */}
        <div className="flex min-w-0 flex-col">
          <SearchableHeader
            icon={<Folder size={14} className="shrink-0" />}
            label="Project"
            query={projectQuery}
            setQuery={setProjectQuery}
            open={projectSearchOpen}
            setOpen={setProjectSearchOpen}
          />
          <div className={columnListClass}>
            <div className="p-1.5">
              {groupedProjects.length === 0 && <EmptyState text="No projects found" />}
              {groupedProjects.map((group, index) => (
                <div key={group.clientId}>
                  <div className="mb-1">
                    <p className="text-muted-foreground px-2 py-1 text-[10px] font-semibold tracking-wide uppercase">
                      {group.clientName}
                    </p>
                    {group.projects.map((project) => (
                      <BoardItem
                        key={project.id}
                        label={project.name}
                        active={selectedData?.project?.id === project.id}
                        onClick={() => projectCallback(project)}
                      />
                    ))}
                  </div>
                  {index !== groupedProjects.length - 1 && <div className="bg-border/40 my-1 h-px" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Categories (milestones) — only when the project has any */}
        {showCategories && (
          <div className="flex min-w-0 flex-col">
            <SearchableHeader
              icon={<CategoryIcon size={14} className="shrink-0" />}
              label="Category"
              required={categoryRequired}
              missingRequired={categoryMissing}
              query={categoryQuery}
              setQuery={setCategoryQuery}
              open={categorySearchOpen}
              setOpen={setCategorySearchOpen}
              disabled={!isProjectSelected}
            />
            <div className={columnListClass}>
              <div className="p-1.5">
                {filteredMilestones.length === 0 ? (
                  <EmptyState text="No matches" />
                ) : (
                  filteredMilestones.map((milestone) => (
                    <BoardItem
                      key={milestone.id}
                      label={milestone.name}
                      active={selectedData?.milestone?.id === milestone.id}
                      onClick={() => milestoneCallback(milestone)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Column 3: Tasks — only when the project has any */}
        {showTasks && (
          <div className="flex min-w-0 flex-col">
            <SearchableHeader
              icon={<List size={14} className="shrink-0" />}
              label="Task"
              required={taskRequired}
              missingRequired={taskMissing}
              query={taskQuery}
              setQuery={setTaskQuery}
              open={taskSearchOpen}
              setOpen={setTaskSearchOpen}
              disabled={!isProjectSelected}
            />
            <div className={columnListClass}>
              <div className="p-1.5">
                {filteredTasks.length === 0 ? (
                  <EmptyState text="No matches" />
                ) : (
                  filteredTasks.map((task) => (
                    <BoardItem
                      key={task.id}
                      label={task.name}
                      active={selectedData?.task?.id === task.id}
                      onClick={() => taskCallback(task)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Compose bar: comment + time + billable + submit */}
      <form
        onSubmit={(e) => submitHandler(e, handleClearForm, selectedData)}
        onKeyDown={(e) => e.key === "Enter" && formValidator() && submitHandler(e, handleClearForm, selectedData)}
        autoComplete="off"
        className="border-t"
      >
        <div className="flex flex-col gap-2 p-3 sm:px-4">
          {/* Row 1: comment input */}
          <div className="border-border bg-background focus-within:border-primary focus-within:ring-primary flex min-h-[52px] items-start rounded-md border px-2 py-2 focus-within:ring-1">
            <MessageSquare className="text-muted-foreground mt-1 shrink-0" size={16} />
            <textarea
              rows={2}
              className="min-h-[36px] w-full resize-y border-0 bg-transparent px-2 py-0.5 text-sm focus:ring-0 focus:outline-0"
              placeholder="Add a comment..."
              value={selectedData?.comment ?? ""}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                // Enter submits; Shift+Enter adds a newline.
                // Stop propagation so the form-level Enter handler doesn't also fire.
                if (e.key === "Enter") {
                  e.stopPropagation();
                  if (!e.shiftKey) {
                    e.preventDefault();
                    if (formValidator()) submitHandler(e as unknown as FormEvent, handleClearForm, selectedData);
                  }
                }
              }}
            />
          </div>

            {/* Row 2: time controls + reset ... billable + submit */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Quick time chips — always available */}
              <div className="flex items-center gap-1">
                {TIME_CHIPS.map((chip) => (
                  <Badge
                    key={chip.id}
                    variant="secondary"
                    className="cursor-pointer rounded-full px-2 py-1 text-[11px]"
                    onClick={() => handleTimeChip(chip.incrementBy)}
                  >
                    {chip.title}
                  </Badge>
                ))}
              </div>

              {/* Time stepper — always available (rounds to the next/prev 30 mins) */}
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  className="h-8 w-8 shrink-0 rounded-full"
                  onClick={() => handleTimeStep("decrease")}
                  disabled={errors.time || currentHours() <= 0}
                  title="Round down to previous 30 mins"
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <Input
                  type="text"
                  placeholder="2:30"
                  className={cn(
                    errors?.time
                      ? "border-destructive ring-1 ring-destructive focus:border-destructive focus:ring-destructive"
                      : "border-border focus:border-primary focus:ring-primary",
                    "h-9 w-[64px] select-none rounded-md border bg-background py-1 text-center text-sm leading-none",
                  )}
                  value={selectedData?.time ?? ""}
                  onChange={(e) => handleLoggedTimeInput(e.currentTarget.value)}
                />
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  className="h-8 w-8 shrink-0 rounded-full"
                  onClick={() => handleTimeStep("increase")}
                  title="Round up to next 30 mins"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Reset — same treatment as classic form */}
              {hasSelection && (
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={handleClearForm}
                  className="shrink-0 cursor-pointer border-destructive/30 text-destructive/70 hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
                  title="Reset form"
                >
                  <ListRestart size={16} />
                </Button>
              )}

              {/* Billable + Submit grouped on the right */}
              <div className="ml-auto flex items-center gap-2">
                {selectedData.project?.billable && (
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    title="Toggle billable"
                    onClick={() =>
                      selectedData?.project?.billable &&
                      setSelectedData((prev) => ({ ...prev, billable: !prev.billable }))
                    }
                    className={cn(
                      "shrink-0",
                      selectedData.billable
                        ? "border-success bg-success text-white hover:bg-success hover:text-white"
                        : "text-slate-400 hover:text-slate-400",
                    )}
                  >
                    <CircleDollarSign size={18} />
                  </Button>
                )}

                <Button size="sm" type="submit" disabled={!formValidator()} className="shrink-0">
                  {edit.isEditing ? "Save" : "Add"}
                </Button>
              </div>
            </div>
          </div>
        </form>
    </div>
  );
};

/* ---------- small presentational helpers ---------- */

type SearchableHeaderProps = {
  icon: React.ReactNode;
  label: string;
  query: string;
  setQuery: (value: string) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  missingRequired?: boolean;
};

const SearchableHeader = ({
  icon,
  label,
  query,
  setQuery,
  open,
  setOpen,
  disabled = false,
  required = false,
  missingRequired = false,
}: SearchableHeaderProps) => {
  const canSearch = !disabled;
  const close = () => {
    setQuery("");
    setOpen(false);
  };
  return (
    <div
      className={cn(
        "flex h-9 items-center gap-2 border-b bg-muted/40 px-3 text-xs font-medium text-muted-foreground",
        !open && canSearch && "cursor-text hover:text-foreground",
        missingRequired && "bg-destructive/5 text-destructive/80",
      )}
      onClick={!open && canSearch ? () => setOpen(true) : undefined}
      title={
        missingRequired
          ? `${label} is required`
          : !open && canSearch
            ? `Click to search ${label.toLowerCase()}`
            : undefined
      }
    >
      {icon}
      {open ? (
        <>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && close()}
            placeholder={`Search ${label.toLowerCase()}...`}
            className="w-full border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-0 focus:ring-0"
          />
          <button type="button" onClick={close} title="Close search" className="shrink-0 rounded p-0.5 hover:bg-muted">
            <X size={13} />
          </button>
        </>
      ) : (
        <>
          <span className="inline-flex items-center gap-0.5">
            {label}
            {required && <RequiredAsterisk />}
          </span>
          {canSearch && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              title={`Search ${label.toLowerCase()}`}
              className="ml-auto shrink-0 rounded p-0.5 hover:bg-muted hover:text-foreground"
            >
              <Search size={13} />
            </button>
          )}
        </>
      )}
    </div>
  );
};

const BoardItem = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "flex w-full cursor-pointer items-start justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
      active ? "bg-accent font-medium text-accent-foreground" : "hover:bg-muted",
    )}
  >
    <span className="min-w-0 flex-1 break-words">{label}</span>
    <Check className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", !active && "invisible")} />
  </button>
);

const EmptyState = ({ text }: { text: string }) => (
  <p className="px-2 py-6 text-center text-xs text-muted-foreground">{text}</p>
);
