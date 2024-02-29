"use client";

import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { XCircle } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { format, minutesToHours } from "date-fns";
import { Checkbox } from "./ui/checkbox";
import { sampleProjects } from "@/app/api/team/loggr-ai/projects-data";
import { timecard } from "@/components/time-entry";

export default function TimeCard({ data, handleClose, handleaddLog }: any) {
  const [selectedProject, setSelectedProject] = useState<any>(data.projectName);
  const [taskOption, setTaskOption] = useState<any>([]);
  const [milestoneOption, setMilestoneOption] = useState<any>([]);

  const [date, month, year] = data.date.split("-");

  const FormSchema = z.object({
    date: z
      .date({
        required_error: "A date of birth is required.",
      })
      .default(new Date(year, month - 1, date)),
    comment: z.string().nonempty(),
    selectedProject: z.number().int("Please Select a Project").default(data.projectId),
    selectedMilestone: z.number().optional(),
    selectedTask: z.number().optional(),
    isBillable: z.string(),
    loggedHrs: z.number().int("Please enter hours"),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const handleSubmit = (data: timecard, e: any) => {
    e.preventDefault();
    handleaddLog(data);
    console.log("Saved to db");
  };

  const handleprojectChange = (e: string) => {
    setSelectedProject(e);
  };

  useEffect(() => {
    const selectedProjectObj = sampleProjects.filter((projects) => projects.name === selectedProject)[0];
    selectedProjectObj.task ? setTaskOption(selectedProjectObj?.task) : setTaskOption([]);
    selectedProjectObj.milestone ? setMilestoneOption(selectedProjectObj?.milestone) : setMilestoneOption([]);
  }, [selectedProject]);

  // console.log()

  return (
    <div className="relative mt-5 rounded-2xl border-2">
      <Button
        onClick={() => handleClose(data)}
        size="icon"
        className="absolute right-5 top-[-20px] bg-transparent p-0 text-secondary-foreground hover:bg-transparent"
      >
        <XCircle className="rounded-full bg-secondary text-gray-400" />
      </Button>
      <Form {...form}>
        <form
          className="flex flex-wrap items-center justify-between gap-[10px]  px-7 py-5"
          onSubmit={(e) => handleSubmit(data, e)}
        >
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <div>
                      <span className="rounded-t-md bg-primary px-2 py-1 text-sm text-primary-foreground">
                        {format(new Date(year, +month - 1, date), "MMM")}
                      </span>
                      <span className="text-md block w-full rounded border-2 border-t-0 text-center">
                        {format(new Date(year, +month - 1, date), "dd")}
                      </span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      selected={field.value}
                      mode="single"
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem className="col-span-2 basis-[85%]">
                <FormControl className="my-2">
                  <Input placeholder="Comment" {...field} value={data.comment} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="selectedProject"
            render={({ field }) => (
              <FormItem className="col-span-2 basis-full">
                <Select
                  value={selectedProject}
                  defaultValue={data.projectName}
                  onValueChange={(e) => {
                    field.onChange();
                    handleprojectChange(e);
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Projects</SelectLabel>
                      {sampleProjects.map((projects, index) => {
                        return (
                          <SelectItem value={projects.name} key={projects.id}>
                            {projects.name}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {milestoneOption?.length ? (
            <FormField
              control={form.control}
              name="selectedMilestone"
              render={({ field }) => (
                <FormItem className="col-span-2 basis-full">
                  <Select onValueChange={field.onChange} defaultValue={data.milestoneName}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select milestone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Milestones</SelectLabel>
                        {milestoneOption?.map((milestone: any) => {
                          return <SelectItem value={milestone.name}>{milestone.name}</SelectItem>;
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            ""
          )}
          {taskOption?.length ? (
            <FormField
              control={form.control}
              name="selectedTask"
              render={({ field }) => (
                <FormItem className="col-span-2 basis-full">
                  <Select onValueChange={field.onChange} defaultValue={data.taskName}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select task" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Tasks</SelectLabel>
                        {taskOption?.map((task: any) => <SelectItem value={task.name}>{task.name}</SelectItem>)}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            ""
          )}
          <FormField
            control={form.control}
            name="loggedHrs"
            render={({ field }) => (
              <FormItem className="align-center col-span-2 flex basis-[25%] items-center gap-2">
                <FormControl className="my-2">
                  <Input
                    placeholder="7.5"
                    defaultValue={minutesToHours(data.time)}
                    {...field}
                    className="text-center"
                  />
                </FormControl>
                <label className="mt-0 text-sm text-gray-500" style={{ marginTop: 0, marginRight: 10 }}>
                  Hrs
                </label>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isBillable"
            render={({ field }) => (
              <FormItem className="align-center mr-auto flex items-center">
                <FormControl>
                  <Checkbox onChange={field.onChange} value={field.value} checked={data.billable} />
                </FormControl>
                <label className="mt-0 text-sm" style={{ marginLeft: 8, marginTop: 0 }}>
                  Billable
                </label>
              </FormItem>
            )}
          />
          <Button type="submit" variant={"outline"}>
            Add Hrs
          </Button>
        </form>
      </Form>
    </div>
  );
}
