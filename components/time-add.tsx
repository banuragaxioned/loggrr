"use client";

import React, { useState } from "react";
import { CalendarIcon, CalendarPlus, Folder, List, ListPlus, Minus, Plus, Rocket } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createTimeLog } from "@/app/_actions/create-timelog-action";
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
          {/* <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <ClassicDatePicker date={date} setDate={setDate} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Project</FormLabel>
                    <Popover open={projectOpen} onOpenChange={setProjectOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                          >
                            {field.value
                              ? projects.find((project) => project.value === field.value)?.label
                              : "Select project"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[352px] p-0">
                        <Command>
                          <CommandInput placeholder="Search project..." />
                          <CommandEmpty>No project found.</CommandEmpty>
                          <CommandGroup>
                            {projects.map((project) => (
                              <CommandItem
                                value={project.label}
                                key={project.value}
                                onSelect={() => {
                                  form.setValue("projectId", project.value);
                                  setProjectOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    project.value === field.value ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {project.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="milestoneId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Milestone</FormLabel>
                    <Popover open={milestoneOpen} onOpenChange={setMilestoneOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                          >
                            {field.value
                              ? projects.find((milestone) => milestone.value === field.value)?.label
                              : "Select milestone"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[352px] p-0">
                        <Command>
                          <CommandInput placeholder="Search milestone..." />
                          <CommandEmpty>No milestones found.</CommandEmpty>
                          <CommandGroup>
                            {projects.map((milestone) => (
                              <CommandItem
                                value={milestone.label}
                                key={milestone.value}
                                onSelect={() => {
                                  form.setValue("milestoneId", milestone.value);
                                  setMilestoneOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    milestone.value === field.value ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {milestone.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-x-2l flex items-center justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  className="h-8 w-8 shrink-0 rounded-full"
                  onClick={() => onClick(-15)}
                  disabled={time <= 15}
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Decrease</span>
                </Button>
                <div className="flex-1 text-center">
                  <div className="text-7xl font-bold tracking-tighter"> {time}</div>
                  <div className="text-[0.70rem] uppercase text-muted-foreground">minutes</div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  className="h-8 w-8 shrink-0 rounded-full"
                  onClick={() => onClick(15)}
                  disabled={time >= 480}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Increase</span>
                </Button>
              </div>
              <DrawerFooter>
                <Button type="submit">Submit</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </Form> */}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

const projects = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const;

const FormSchema = z.object({
  milestoneId: z.string({
    required_error: "Please select a milestone.",
  }),
  date: z.date({
    required_error: "A date is required.",
  }),
  projectId: z.string({
    required_error: "A project is required.",
  }),
});
