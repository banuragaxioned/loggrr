"use client";

import * as React from "react";
import { CalendarIcon, CalendarPlus, ListPlus, Minus, Plus } from "lucide-react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { Calendar } from "./ui/calendar";
import { createTimeLog } from "@/app/_actions/create-timelog-action";

const data = [
  {
    time: 90,
  },
  {
    time: 120,
  },
  {
    time: 180,
  },
  {
    time: 240,
  },
  {
    time: 300,
  },
  {
    time: 360,
  },
  {
    time: 420,
  },
];

export function TimeAdd() {
  const [time, setTime] = React.useState(60);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    data.projectId = "1";
    data.milestoneId = "1";
    const result = await createTimeLog(data, "axioned", 1, time);
    if (result.success) {
      toast("Time entry was created");
      form.reset();
    } else {
      toast("Something went wrong.");
    }
  }

  const [projectOpen, setProjectOpen] = React.useState(false);
  const [milestoneOpen, setMilestoneOpen] = React.useState(false);
  const [dateOpen, setDateOpen] = React.useState(false);

  function onClick(adjustment: number) {
    setTime(Math.max(15, Math.min(480, time + adjustment)));
  }

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
            <DrawerDescription>Track your time for the day</DrawerDescription>
          </DrawerHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover open={dateOpen} onOpenChange={setDateOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                          onDayClick={() => setDateOpen(false)}
                        />
                      </PopoverContent>
                    </Popover>
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
          </Form>
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
