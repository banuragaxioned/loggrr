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
  time: string;
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
  time: "1.50",
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

  /*
   * handleTimeUpdate: function to increase or decrease time based on provided value
   * action: increase | decrease
   * timeVariation: Hours to increase or decrease
   */
  const handleTimeUpdate = (action: "increase" | "descrease", timeVariation: number) => {
    const previousTime = +selectedData.time;
    if (previousTime && !isNaN(previousTime)) {
      const timeToUpdate = action === "increase" ? previousTime + timeVariation : previousTime - timeVariation;
      setSelectedData({ ...selectedData, time: timeToUpdate.toFixed(2) });
    }
  };

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
              <div className="relative flex w-full items-center">
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  className="h-8 w-8 shrink-0 rounded-full"
                  onClick={() => handleTimeUpdate("descrease", 1)}
                  disabled={errors.time || +selectedData.time <= 1}
                  title="Decrease by an hour"
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Decrease by an hour</span>
                </Button>
                <Input
                  type="text"
                  placeholder="7.30"
                  className={cn(
                    errors?.time
                      ? "border-destructive px-4 ring-1 ring-destructive focus:border-destructive focus:ring-destructive"
                      : "border-border focus:border-primary focus:ring-primary",
                    "mx-3 h-20 w-full select-none rounded-md border bg-transparent py-1 text-center text-4xl leading-none transition-all duration-75 ease-out focus:outline-none",
                  )}
                  value={selectedData?.time}
                  onChange={(e) => handleLoggedTimeInput(e.currentTarget.value)}
                />
                {/* Indicator */}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-sm text-muted-foreground">Hours</span>
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  className="h-8 w-8 shrink-0 rounded-full"
                  onClick={() => handleTimeUpdate("increase", 1)}
                  disabled={+selectedData.time >= 9}
                  title="Increase by an hour"
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Increase by an hour</span>
                </Button>
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
