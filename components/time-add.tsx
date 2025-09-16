"use client";

import React, { useState } from "react";
import { CalendarPlus, Folder, List, Milestone as CategoryIcon, Minus, Plus } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { hoursToDecimal } from "@/lib/helper";
import { useQueryState } from "nuqs";

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

const TIME_CHIPS = [
  {
    id: 1,
    title: "+15 mins",
    incrementBy: 0.25, // in hours
  },
  {
    id: 2,
    title: "+45 mins",
    incrementBy: 0.75,
  },
  {
    id: 3,
    title: "+1 hour",
    incrementBy: 1,
  },
];

export function TimeAdd({ projects }: { projects?: Project[] }) {
  const searchParams = useSearchParams();
  const initialDate = searchParams.get("date") ? new Date(searchParams.get("date") as string) : new Date();
  const { team } = useParams();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [selectedData, setSelectedData] = useState<SelectedData>(initialDataState);
  const [projectMilestones, setProjectMilestones] = useState<Milestone[]>([]);
  const [projectTasks, setprojectTasks] = useState<Milestone[]>([]);
  const [errors, setErrors] = useState<ErrorsObj>({});
  const [date, setDate] = useQueryState("date", {
    parse: (value: string) => new Date(value),
    serialize: (date: Date) => format(date, "yyyy-MM-dd"),
    defaultValue: initialDate,
  });

  const handleClearForm = () => {
    setSelectedData(initialDataState);
  };

  const formValidator = () => {
    const { project, comment, time } = selectedData || {};
    return project && comment?.trim().length && time && !errors?.time;
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

  /*
   * handleTimeUpdate: function to increase or decrease time based on provided value
   * action: increase | decrease
   * timeVariation: Hours to increase or decrease
   */
  const handleTimeUpdate = (action: "increase" | "descrease", timeVariation: number) => {
    const previousTime = +selectedData.time.replace(":", ".");
    if (!isNaN(previousTime)) {
      const timeToUpdate = action === "increase" ? previousTime + timeVariation : previousTime - timeVariation;
      setSelectedData({ ...selectedData, time: timeToUpdate.toFixed(2) });
      if (timeToUpdate > 0) {
        setErrors({ ...errors, time: false });
      }
    } else {
      // If any text is entered
      setSelectedData({ ...selectedData, time: `${(0 + timeVariation).toFixed(2)}` });
      setErrors({ ...errors, time: false });
    }
  };

  /*
   * submitTimeEntry: The following function will return the time entry of the specified id
   */
  const submitTimeEntry = async () => {
    if (!selectedData) return;
    const { project, milestone, time, comment, billable, task } = selectedData || {};
    const dateToStoreInDB = format(date, "yyyy-MM-dd"); // Extracts only the date; // Extracts only the date
    const dataToSend = {
      team,
      project: project?.id,
      milestone: milestone?.id,
      time: +hoursToDecimal(time ?? "0") * 60,
      comments: comment?.trim(),
      billable: billable ? true : false,
      task: task?.id,
      date: dateToStoreInDB,
    };

    try {
      const response = await fetch("/api/team/time-entry", {
        method: "POST",
        body: JSON.stringify(dataToSend),
      });
      if (response.ok) {
        toast.success(`Added time entry in ${project?.name}`);
        router.refresh();
        handleClearForm();
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error submitting form!", error);
    }
  };

  const renderTimeChips = TIME_CHIPS.map((chip) => (
    <Badge
      key={chip.id}
      variant="secondary"
      className="w-[80px] cursor-pointer justify-center rounded-full py-1.5"
      onClick={() => handleTimeUpdate("increase", chip.incrementBy)}
    >
      {chip.title}
    </Badge>
  ));

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="default" size="icon">
          <CalendarPlus className="h-6 w-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="relative z-10 mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Add Time</DrawerTitle>
            <DrawerDescription>Add your time for the day</DrawerDescription>
          </DrawerHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (formValidator()) {
                submitTimeEntry();
                setOpen(false);
              }
            }}
          >
            {/* Form/Drawer Body */}
            <div className="flex w-full flex-col gap-3 p-4 pb-0">
              <div className="w-full">
                <ClassicDatePicker date={date} setDate={setDate} />
              </div>
              <div className="w-full-combo">
                <ComboBox
                  searchable
                  icon={<Folder size={16} />}
                  options={projects ?? []}
                  label="Project"
                  selectedItem={selectedData?.project}
                  handleSelect={(selected) => dropdownSelectHandler(selected, projects || [], projectCallback)}
                  className="w-full max-w-full"
                />
              </div>
              <div className="w-full-combo">
                <ComboBox
                  searchable
                  icon={<CategoryIcon size={17} />}
                  options={projectMilestones}
                  label="Category"
                  selectedItem={selectedData?.milestone}
                  handleSelect={(selected) => dropdownSelectHandler(selected, projectMilestones, milestoneCallback)}
                  disabled={!selectedData?.project?.id || !projectMilestones.length}
                  className="w-full max-w-full"
                />
              </div>
              <div className="w-full-combo">
                <ComboBox
                  searchable
                  icon={<List size={16} />}
                  options={projectTasks}
                  label="Task"
                  selectedItem={selectedData?.task}
                  handleSelect={(selected: string) => dropdownSelectHandler(selected, projectTasks, taskCallback)}
                  disabled={!selectedData?.project?.id || !projectTasks.length}
                  className="w-full max-w-full"
                />
              </div>
              <div className="w-full">
                <Input
                  type="text"
                  placeholder="Add a comment..."
                  value={selectedData?.comment ?? ""}
                  onChange={(e) => setCommentText(e.target.value)}
                />
              </div>
              <Label
                className="flex w-full cursor-pointer items-center gap-2 text-muted-foreground"
                htmlFor="billable-hours"
                title={!selectedData?.project?.billable ? "Non-billable project" : "Toggle Billable"}
              >
                <Switch
                  checked={selectedData.billable}
                  onCheckedChange={() =>
                    selectedData?.project?.billable &&
                    setSelectedData((prev) => ({ ...prev, billable: !selectedData?.billable }))
                  }
                  disabled={!selectedData?.project?.billable}
                  id="billable-hours"
                  className="data-[state=checked]:bg-success"
                />
                Billable
              </Label>
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
                  tabIndex={-1}
                  type="text"
                  placeholder="2:30"
                  className={cn(
                    errors?.time
                      ? "border-destructive px-4 ring-1 ring-destructive focus:border-destructive focus:ring-destructive"
                      : "focus:border-primary focus:ring-primary",
                    "mx-3 h-20 w-full select-none rounded-md border-transparent bg-transparent py-1 text-center text-4xl leading-none transition-all duration-75 ease-out focus:outline-none",
                  )}
                  value={selectedData?.time}
                  onChange={(e) => handleLoggedTimeInput(e.currentTarget.value)}
                />
                {/* Indicator */}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-sm text-muted-foreground">
                  Hour{+selectedData.time.replace(":", ".") > 1 && "s"}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  className="h-8 w-8 shrink-0 rounded-full"
                  onClick={() => handleTimeUpdate("increase", 1)}
                  title="Increase by an hour"
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Increase by an hour</span>
                </Button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">{renderTimeChips}</div>
            </div>
            <DrawerFooter className="mb-4">
              <Button type="submit" disabled={!formValidator()}>
                Submit
              </Button>
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleClearForm();
                  }}
                >
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
