import React, { FormEvent, useEffect, useState } from "react";
import { CircleDollarSign, Folder, Info, List, ListRestart, MessageSquare, Rocket } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ComboBox } from "../ui/combobox";
import { Project, Milestone } from "@/types";
import { EditReferenceObj } from "../time-entry";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

export type SelectedData = {
  client?: Milestone;
  project?: Project;
  milestone?: Milestone | null;
  task?: Milestone | null;
  comment?: string | null;
  time?: string;
  billable?: boolean;
};

interface TimelogProps {
  team: string;
  projects: Project[];
  date: Date;
  edit: EditReferenceObj;
  submitHandler: (e: FormEvent, clearForm: Function, selectedData?: SelectedData) => void;
}

type ErrorsObj = {
  time?: boolean;
};

const initialDataState = {
  client: undefined,
  project: undefined,
  milestone: null,
  task: null,
  comment: "",
  time: "",
  billable: false,
};

export const TimeLogForm = ({ projects, edit, submitHandler }: TimelogProps) => {
  const [onCommentFocus, setOnCommentFocus] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<SelectedData>(initialDataState);
  const [projectMilestones, setProjectMilestones] = useState<Milestone[]>([]);
  const [projectTasks, setprojectTasks] = useState<Milestone[]>([]);
  const [errors, setErrors] = useState<ErrorsObj>({});

  const handleClearForm = () => {
    setSelectedData(initialDataState);
    setErrors({});
  };

  const formValidator = () => {
    const { project, comment, time, milestone } = selectedData || {};
    return project && milestone && comment?.trim().length && time && !errors?.time;
  };

  const handleLoggedTimeInput = (time: string) => {
    const numberPattern = new RegExp(/^([1-9]\d*(\.|\:)\d{0,2}|0?(\.|\:)\d*[1-9]\d{0,2}|[1-9]\d{0,2})$/, "g");
    numberPattern.test(time) ? setErrors({ ...errors, time: false }) : setErrors({ ...errors, time: true });
    setSelectedData({ ...selectedData, time: time });
  };

  /*
   * dropdownSelectHandler: takes ID of selected project and add its data
   */
  const dropdownSelectHandler = (selected: string, arr: Milestone[], callback: Function) => {
    const foundData = arr.find((obj) => obj.id === +selected);
    callback(foundData);
  };

  /*
   * projectCallback: function called when project is selected
   */
  const projectCallback = (selected: Project) => {
    setSelectedData({
      ...selectedData,
      client: selected?.client,
      project: { id: selected.id, name: selected?.name, billable: selected?.billable },
    });
    setProjectMilestones(() => {
      const milestone = selected?.milestone;
      return milestone ? milestone : [];
    });
    setprojectTasks(() => {
      const task = selected?.task;
      return task ? task : [];
    });
    if (selected.id !== selectedData.project?.id) {
      setSelectedData((prevData) => {
        return {
          ...prevData,
          milestone: undefined,
          task: undefined,
          billable: prevData.project?.billable ? true : false,
        };
      });
    }
  };

  /*
   * milestoneCallback: function called when milestone is selected
   */
  const milestoneCallback = (selected: Milestone) => setSelectedData((prev) => ({ ...prev, milestone: selected }));

  /*
   * taskCallback: function called when task is selected
   */
  const taskCallback = (selected: Milestone) => {
    const data: SelectedData = { ...selectedData, task: selected };
    setSelectedData(data);
  };

  /*
   * setCommentText: sets the comment text in the form
   */
  const setCommentText = (str: string) => setSelectedData({ ...selectedData, comment: str });

  useEffect(() => {
    if (edit.isEditing) {
      const foundProject = projects.find((project) => project.id === edit.obj.project?.id);
      setSelectedData(edit.obj);
      setProjectMilestones(() => {
        const milestone = foundProject?.milestone;
        return milestone ? milestone : [];
      });
      setprojectTasks(() => {
        const task = foundProject?.task;
        return task ? task : [];
      });
    } else {
      handleClearForm();
    }
  }, [edit, projects]);

  const renderFormText = () => {
    if (!selectedData.project?.id) return "Select a project first...";
    if (!selectedData.milestone?.id) return "Select a milestone...";
    return "Add a comment...";
  };

  const isProjectAndMilestoneSelected = selectedData?.project?.id && selectedData?.milestone?.id;

  return (
    <div className="p-2">
      <div className="flex items-center justify-between overflow-y-auto rounded-t-xl bg-secondary px-3 py-2">
        <div className="inline-flex items-center gap-x-2 text-xs">
          {/* Dropdown selections */}
          <ComboBox
            tabIndex={1}
            searchable
            icon={<Folder size={16} />}
            options={projects}
            label="Project"
            selectedItem={selectedData?.project}
            handleSelect={(selected) => dropdownSelectHandler(selected, projects, projectCallback)}
          />
          <ComboBox
            tabIndex={2}
            searchable
            icon={<Rocket size={16} />}
            options={projectMilestones}
            label="Milestone"
            selectedItem={selectedData?.milestone}
            handleSelect={(selected) => dropdownSelectHandler(selected, projectMilestones, milestoneCallback)}
            disabled={!selectedData?.project?.id}
          />
          <ComboBox
            tabIndex={3}
            searchable
            icon={<List size={16} />}
            options={projectTasks}
            label="Task"
            selectedItem={selectedData?.task}
            handleSelect={(selected: string) => dropdownSelectHandler(selected, projectTasks, taskCallback)}
            disabled={!isProjectAndMilestoneSelected}
          />
        </div>
        {(selectedData?.milestone || selectedData?.project || selectedData?.task) && (
          <Button
            tabIndex={8}
            variant="outline"
            onClick={handleClearForm}
            size="icon"
            type="button"
            disabled={!(selectedData?.milestone || selectedData?.project || selectedData?.task)}
          >
            <ListRestart size={16} />
          </Button>
        )}
      </div>
      <div className="border-box z-[3] mx-auto w-full rounded-b-xl border bg-transparent">
        <form
          onSubmit={(e) => submitHandler(e, handleClearForm, selectedData)}
          onKeyDown={(e) => e.key === "Enter" && formValidator() && submitHandler(e, handleClearForm, selectedData)}
          autoComplete="off"
        >
          <div
            className={cn(
              onCommentFocus ? "rounded-b-sm border-primary ring-2 ring-primary ring-offset-0 " : "border-border",
              "flex items-center justify-between rounded-b-xl px-3 py-2",
              !isProjectAndMilestoneSelected && "pointer-events-none",
            )}
          >
            <div className="ml-2 flex basis-[70%] items-center">
              {!isProjectAndMilestoneSelected ? (
                <Info className="shrink-0 text-gray-500" size={18} />
              ) : (
                <MessageSquare onClick={() => setOnCommentFocus(true)} className="shrink-0" size={18} />
              )}
              <input
                tabIndex={isProjectAndMilestoneSelected ? 4 : -1}
                className="placeholder:text-info-light peer-focus:bg-background-dark w-full select-none border-0 bg-transparent px-2 py-1.5 text-sm focus:outline-0 focus:ring-0"
                placeholder={renderFormText()}
                value={selectedData?.comment ?? ""}
                onChange={(e) => setCommentText(e.target.value)}
                onFocus={() => setOnCommentFocus(true)}
                onBlur={() => setOnCommentFocus(false)}
              />
            </div>
            <span className="flex items-center gap-4">
              {selectedData.project?.billable && (
                <Button
                  tabIndex={isProjectAndMilestoneSelected ? 5 : -1}
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={() =>
                    selectedData?.project?.billable &&
                    setSelectedData((prev) => ({ ...prev, billable: !selectedData?.billable }))
                  }
                  className={cn(
                    selectedData.billable && "text-success hover:text-success",
                    !selectedData.billable && "text-slate-400 hover:text-slate-400",
                  )}
                >
                  <CircleDollarSign size={20} />
                </Button>
              )}
              <Input
                tabIndex={isProjectAndMilestoneSelected ? 6 : -1}
                type="text"
                placeholder="7:30"
                className={cn(
                  errors?.time
                    ? "border-destructive px-4 ring-1 ring-destructive focus:border-destructive focus:ring-destructive"
                    : "border-border focus:border-primary focus:ring-primary",
                  "placeholder:text-disabled-light focus:outline-none` h-9 w-[66px] select-none rounded-md border bg-transparent py-1 text-center text-sm leading-none transition-all duration-75 ease-out",
                )}
                value={selectedData?.time}
                onChange={(e) => handleLoggedTimeInput(e.currentTarget.value)}
                disabled={!isProjectAndMilestoneSelected}
              />
              <Button
                size="sm"
                type="submit"
                disabled={!formValidator()}
                tabIndex={
                  selectedData?.project && selectedData.milestone && selectedData?.comment && selectedData?.time
                    ? 7
                    : -1
                }
                className="disabled:disabled border disabled:hover:bg-primary"
              >
                {edit.isEditing ? "Update" : "Submit"}
              </Button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
