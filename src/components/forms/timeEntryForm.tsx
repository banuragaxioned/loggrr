"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import useToast from "@/hooks/useToast";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { InlineCombobox } from "../ui/combobox";
import { Icons } from "../icons";

const formSchema = z.object({
  project: z.number().int("Please select a Project"),
  milestone: z.number().int("Please select a Milestone"),
  time: z.string().regex(new RegExp(/^([1-9]\d*(\.)\d{0,2}|0?(\.)\d*[1-9]\d{0,2}|[1-9]\d{0,2})$/), "Please enter time"),
  comments: z.string().nonempty("Please add comments"),
  billable: z.boolean(),
});

type Milestone = {
  id: number;
  name: string;
};

interface Project {
  id: number;
  name: string;
  milestone?: Milestone[];
}

interface TimeEntryFormProps {
  team: string;
  projects: Project[];
}

export function TimeEntryForm({ team, projects }: TimeEntryFormProps) {
  const router = useRouter();
  const showToast = useToast();
  const SheetCloseButton = useRef<HTMLButtonElement>(null);
  const [projectMilestone, setprojectmilestone] = useState<Milestone[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      billable: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch("/api/team/time-entry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        team,
        project: values.project,
        milestone: values.milestone,
        time: Number(values.time),
        comments: values.comments,
        billable: values.billable,
      }),
    });

    if (!response?.ok) {
      return showToast("Something went wrong.", "warning");
    }

    form.reset();
    showToast("A new Project was created", "success");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto my-2 flex w-3/5 flex-col gap-y-1">
        <FormField
          control={form.control}
          name="project"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Project</FormLabel>
              <FormControl className="mt-2">
                <InlineCombobox
                  label="Select Project"
                  options={projects}
                  setVal={form.setValue}
                  fieldName="project"
                  selectHandler={(id) =>
                    setprojectmilestone((prev) => {
                      const milestone = projects.find((project) => project.id === id)?.milestone;
                      return milestone ? milestone : [];
                    })
                  }
                  icon={<Icons.user className="mr-2 h-4 w-4 shrink-0 opacity-50" />}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="milestone"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Milestone</FormLabel>
              <FormControl className="mt-2">
                <InlineCombobox
                  label="Select Milestone"
                  options={projectMilestone}
                  setVal={form.setValue}
                  fieldName="milestone"
                  icon={<Icons.user className="mr-2 h-4 w-4 shrink-0 opacity-50" />}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mb-2 flex gap-x-4">
          <div>
            <FormLabel className="basis-auto">Time</FormLabel>
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <div className="relative mt-2 flex rounded-md border-[1px]">
                    <FormControl>
                      <Input
                        placeholder="Time"
                        {...field}
                        type="number"
                        className="w-20 border-none  outline-none focus:ring-0"
                      />
                    </FormControl>
                    <span className="block h-full bg-hover p-2 text-center text-neutral-400">Hours</span>
                  </div>
                  <FormMessage className="relative -bottom-0 w-full" />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="comments"
            render={({ field }) => (
              <FormItem className="col-span-2 mb-2 w-full">
                <FormLabel>Comments</FormLabel>
                <FormControl className="mt-2">
                  <Input placeholder="Describe the activity..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="billable"
          render={({ field }) => (
            <FormItem className="col-span-2 mb-2 flex gap-x-2">
              <FormControl>
                <Input {...field} value={""} type="checkbox" className="h-2 w-2" id="billable" />
              </FormControl>
              <FormLabel htmlFor="billable">Billable</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-x-4">
          <Button type="submit" variant="secondary">
            Submit
          </Button>
          <Button type="submit" ref={SheetCloseButton}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
