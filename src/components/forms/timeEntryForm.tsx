"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useToast from "@/hooks/useToast";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { InlineCombobox } from "../ui/combobox";
import { Icons } from "../icons";
import { CalendarDateRangePicker } from "@/components/datePicker";
import { ProjectInterval } from "@prisma/client";
import { Client, AllUsersWithAllocation } from "@/types";

const formSchema = z.object({
 
});

interface TimeEntryFormProps {
  team: string;
}

export function TimeEntryForm({ team }: TimeEntryFormProps) {
  const router = useRouter();
  const showToast = useToast();
  const SheetCloseButton = useRef<HTMLButtonElement>(null);
  const [isOngoing, setOngoing] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch("/api/team/project/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        
      }),
    });

    if (!response?.ok) {
      return showToast("Something went wrong.", "warning");
    }

    form.reset();
    SheetCloseButton.current?.click();
    showToast("A new Project was created", "success");
    router.refresh();
  }


  return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="my-2 flex flex-col gap-y-1 w-3/5 mx-auto">
            <FormField
              control={form.control}
              name="project"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Project</FormLabel>
                  <FormControl className="mt-2">
                    <InlineCombobox
                      label="Select Project"
                      options={[]}
                      setVal={form.setValue}
                      fieldName="project"
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
                      options={[]}
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
           <div className="flex border-[1px] mt-2 rounded-md">
           <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormControl >
                    <Input placeholder="Time" {...field} type="number" className="outline-none w-20  border-none focus:ring-0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <span className="block p-2 h-full bg-hover text-center text-neutral-400">Hours</span>
            </div>
           </div>
              <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem className="col-span-2 mb-2 w-full">
                  <FormLabel>Comments</FormLabel>
                  <FormControl className="mt-2">
                    <Input placeholder="Describe the activity..." {...field}/>
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
                <FormItem className="col-span-2 flex gap-x-2 mb-2">
                  <FormControl >
                    <Input  {...field} type="checkbox" className="w-2 h-2" id="billable"/>
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
