import React, { Dispatch, FormEvent, useEffect, useState } from "react";
import { CircleDollarSign, Folder, List, MessageSquare, Rocket } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Command } from "cmdk";
import { Toggle } from "../ui/toggle";
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

export const TimeLogFormV2 = ({ projects, edit, submitHandler }: TimelogProps) => {
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
      setSelectedData(edit.obj);
    } else {
      handleClearForm();
    }
  }, [edit]);

  return (
    <div className="p-2">
      <div className="flex items-center justify-between overflow-y-auto rounded-t-xl bg-secondary px-5 py-[10px]">
        <div className="inline-flex items-center gap-x-2 text-xs">
          {/* Dropdown selections */}
          <ComboBox
            tabIndex={2}
            searchable
            icon={<Folder size={16} />}
            options={projects}
            label="Project"
            selectedItem={selectedData?.project}
            handleSelect={(selected) => dropdownSelectHandler(selected, projects, projectCallback)}
          />
          <ComboBox
            tabIndex={3}
            searchable
            icon={<Rocket size={16} />}
            options={projectMilestones}
            label="Milestone"
            selectedItem={selectedData?.milestone}
            handleSelect={(selected) => dropdownSelectHandler(selected, projectMilestones, milestoneCallback)}
            disabled={!selectedData?.project?.id}
          />
          <ComboBox
            tabIndex={4}
            searchable
            icon={<List size={16} />}
            options={projectTasks}
            label="Task"
            selectedItem={selectedData?.task}
            handleSelect={(selected: string) => dropdownSelectHandler(selected, projectTasks, taskCallback)}
            disabled={!(selectedData?.project?.id && selectedData?.milestone?.id)}
          />
        </div>
        <Button
          tabIndex={9}
          variant="outline"
          onClick={handleClearForm}
          size="sm"
          type="submit"
          disabled={!(selectedData?.milestone || selectedData?.project || selectedData?.task)}
          className={`text-content-light hover:border-info-light border  border-border bg-transparent px-[12px] py-[7px] text-xs leading-none focus:border-primary focus:ring-1 focus:ring-primary`}
        >
          Clear
        </Button>
      </div>
      <div className="border-box z-[3] mx-auto w-full rounded-b-xl border bg-transparent">
        <form
          onSubmit={(e) => submitHandler(e, handleClearForm, selectedData)}
          onKeyDown={(e) => e.key === "Enter" && formValidator() && submitHandler(e, handleClearForm, selectedData)}
        >
          <Command label="Command Menu" className="text-content-light relative">
            <div
              className={`${
                onCommentFocus ? "rounded-b-sm border-primary ring-2 ring-primary ring-offset-0 " : "border-border"
              } flex items-center justify-between rounded-b-xl px-[18px] py-[7px]`}
            >
              <div className="flex basis-[70%] items-center">
                <MessageSquare
                  onClick={() => setOnCommentFocus(true)}
                  className="text-info-light h-[18px] w-[18px] shrink-0 stroke-2"
                />
                <input
                  tabIndex={5}
                  className="placeholder:text-info-light peer-focus:bg-background-dark w-full select-none border-0 bg-transparent px-2 text-sm focus:outline-0 focus:ring-0"
                  placeholder="Add comment on what you did..."
                  value={selectedData?.comment ?? ""}
                  onChange={(e) => setCommentText(e.target.value)}
                  onFocus={() => setOnCommentFocus(true)}
                  onBlur={() => setOnCommentFocus(false)}
                />
              </div>
              <span className="flex items-center gap-4">
                {selectedData.project?.billable && (
                  <Button
                    tabIndex={6}
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
                  tabIndex={7}
                  type="text"
                  placeholder="7:30"
                  className={cn(
                    errors?.time
                      ? "border-destructive px-4 ring-1 ring-destructive focus:border-destructive focus:ring-destructive"
                      : "border-border focus:border-primary focus:ring-primary",
                    "placeholder:text-disabled-light focus:outline-none` w-[66px] select-none rounded-md border bg-transparent text-center text-sm leading-none transition-all duration-75 ease-out",
                  )}
                  value={selectedData?.time}
                  onChange={(e) => handleLoggedTimeInput(e.currentTarget.value)}
                />
                <Button
                  size="sm"
                  type="submit"
                  disabled={!formValidator()}
                  tabIndex={
                    selectedData?.project && selectedData.milestone && selectedData?.comment && selectedData?.time
                      ? 8
                      : -1
                  }
                  className="disabled:disabled border disabled:hover:bg-primary"
                >
                  {edit.isEditing ? "Update" : "Submit"}
                </Button>
              </span>
            </div>
          </Command>
        </form>
      </div>
    </div>
  );
};
