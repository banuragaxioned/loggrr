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
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AllocationFrequency, Tenant } from "@prisma/client";
import { CalendarDateRangePicker } from "@/components/datePicker";
import { cleanDate } from "@/lib/helper";
import { InlineCombobox } from "../ui/inlineCombobox";
import { ComboboxOptions } from "../../types";

const formSchema = z.object({
  projectId: z.coerce.number().min(1),
  userId: z.coerce.number().min(1),
  date: z.coerce.date(), // TODO: make this required
  frequency: z.nativeEnum(AllocationFrequency),
  enddate: z.coerce.date().optional(),
  billableTime: z.coerce.number(),
  nonBillableTime: z.coerce.number(),
});

export function NewAllocationForm({ team, projects, users }: { team: Tenant["slug"], projects: ComboboxOptions[], users: ComboboxOptions[] }) {
  const [isOngoing, setOngoing] = useState(false)
  const router = useRouter();
  const showToast = useToast();
  const SheetCloseButton = useRef<HTMLButtonElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      frequency: AllocationFrequency.DAY,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch("/api/team/allocation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId: values.projectId,
        userId: values.userId,
        date: values.date,
        frequency: values.frequency,
        enddate: values?.enddate,
        billableTime: values.billableTime,
        nonBillableTime: values.nonBillableTime,
        team: team,
      }),
    });

    console.log(values);
    console.log(response);

    if (!response?.ok) {
      return showToast("Something went wrong.", "warning");
    }

    form.reset();
    SheetCloseButton.current?.click();
    showToast("A new allocation was created", "success");
    router.refresh();
  }

  useEffect(() => {
    if(isOngoing) form.setValue("frequency", "ONGOING")
    else form.setValue("frequency", "DAY")
  }, [isOngoing])

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Add</Button>
      </SheetTrigger>
      <SheetContent position="right" size="sm">
        <Form {...form}>
          <SheetHeader>
            <SheetTitle>Add a new allocation</SheetTitle>
            <SheetDescription>Good planning goes a long way.</SheetDescription>
          </SheetHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="my-2 grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Project</FormLabel>
                  <FormControl className="mt-2">
                    <InlineCombobox options={projects} setVal={form.setValue} fieldName="projectId"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>User</FormLabel>
                  <FormControl className="mt-2">
                    <InlineCombobox options={users} setVal={form.setValue} fieldName="userId"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Duration</FormLabel>
                  <FormControl className="mt-2">
                    <CalendarDateRangePicker setVal={form.setValue} setOngoing={setOngoing} isOngoing={isOngoing}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billableTime"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Billable</FormLabel>
                  <FormControl className="mt-2">
                    <Input type="number" placeholder="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nonBillableTime"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Non-billable</FormLabel>
                  <FormControl className="mt-2">
                    <Input type="number" placeholder="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button type="submit" variant="secondary">
                Submit
              </Button>
              <SheetClose asChild>
                <Button type="submit" ref={SheetCloseButton}>
                  Cancel
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
