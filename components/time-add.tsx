"use client";

import React, { useState } from "react";
import { CalendarPlus, Folder, List, ListPlus, Minus, Plus, Rocket } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { cn } from "@/lib/utils";
import { ClassicDatePicker } from "./date-picker";

import { Milestone, Project } from "@/types";
import { ComboBox } from "./ui/combobox";
import { Input } from "./ui/input";

export type SelectedData = {
  client?: Milestone;
  project?: Project;
  milestone?: Milestone | null;
  task?: Milestone | null;
  comment?: string | null;
  time?: string;
  billable?: boolean;
};

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

export function TimeAdd({ projects }: { projects: Project[] }) {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedData, setSelectedData] = useState<SelectedData>(initialDataState);
  const [projectMilestones, setProjectMilestones] = useState<Milestone[]>([]);
  const [projectTasks, setprojectTasks] = useState<Milestone[]>([]);
  const [errors, setErrors] = useState<ErrorsObj>({});

  const handleClearForm = () => {
    setSelectedData(initialDataState);
  };

  const formValidator = () => {
    const { project, comment, time, milestone } = selectedData || {};
    return project && milestone && comment?.trim().length && time && !errors?.time;
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

  const handleLoggedTimeInput = (time: string) => {
    const numberPattern = new RegExp(/^([1-9]\d*(\.|\:)\d{0,2}|0?(\.|\:)\d*[1-9]\d{0,2}|[1-9]\d{0,2})$/, "g");
    numberPattern.test(time) ? setErrors({ ...errors, time: false }) : setErrors({ ...errors, time: true });
    setSelectedData({ ...selectedData, time: time });
  };

  const isProjectAndMilestoneSelected = selectedData?.project?.id && selectedData?.milestone?.id;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="default" size="icon">
          <CalendarPlus className="h-6 w-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Add Time</DrawerTitle>
            <DrawerDescription>Add your time for the day</DrawerDescription>
          </DrawerHeader>
          <form>
            {/* Form/Drawer Body */}
            <div className="w-full p-4">
              <div className="mb-3 w-full">
                {/* <p className="mb-1 text-sm text-muted-foreground">Date</p> */}
                <ClassicDatePicker date={date} setDate={setDate} />
              </div>
              <div className="mb-3 w-full">
                <ComboBox
                  searchable
                  icon={<Folder size={16} />}
                  options={projects}
                  label="Project"
                  selectedItem={selectedData?.project}
                  handleSelect={(selected) => dropdownSelectHandler(selected, projects, projectCallback)}
                />
              </div>
              <div className="mb-3 w-full">
                <ComboBox
                  searchable
                  icon={<Rocket size={16} />}
                  options={projectMilestones}
                  label="Milestone"
                  selectedItem={selectedData?.milestone}
                  handleSelect={(selected) => dropdownSelectHandler(selected, projectMilestones, milestoneCallback)}
                  disabled={!selectedData?.project?.id}
                />
              </div>
              <div className="mb-3 w-full">
                <ComboBox
                  searchable
                  icon={<List size={16} />}
                  options={projectTasks}
                  label="Task"
                  selectedItem={selectedData?.task}
                  handleSelect={(selected: string) => dropdownSelectHandler(selected, projectTasks, taskCallback)}
                  disabled={!isProjectAndMilestoneSelected}
                />
              </div>
              <div className="mb-3 w-full">
                <Input
                  disabled={!isProjectAndMilestoneSelected}
                  type="text"
                  placeholder="Add a comment..."
                  value={selectedData?.comment ?? ""}
                  onChange={(e) => setCommentText(e.target.value)}
                />
              </div>
              <div className="w-full">
                <Input
                  type="text"
                  placeholder="7:30"
                  className={cn(
                    errors?.time
                      ? "border-destructive px-4 ring-1 ring-destructive focus:border-destructive focus:ring-destructive"
                      : "border-border focus:border-primary focus:ring-primary",
                    "h-20 w-full select-none rounded-md border bg-transparent py-1 text-center text-sm leading-none transition-all duration-75 ease-out focus:outline-none",
                  )}
                  value={selectedData?.time}
                  onChange={(e) => handleLoggedTimeInput(e.currentTarget.value)}
                  disabled={!isProjectAndMilestoneSelected}
                />
              </div>
            </div>
            <DrawerFooter className="mb-4">
              <Button type="submit" disabled={!formValidator()}>
                Submit
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" onClick={() => handleClearForm()}>
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
