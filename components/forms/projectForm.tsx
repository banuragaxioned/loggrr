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
import { toast } from "sonner";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { InlineCombobox } from "../ui/combobox";
import { Activity, User } from "lucide-react";
import { CalendarDateRangePicker } from "@/components/date-picker";
import { ProjectInterval } from "@prisma/client";
import { Client, AllUsersWithAllocation } from "@/types";

const formSchema = z.object({
  client: z.number().int().min(1, "Please select a client"),
  project: z.string().min(3).max(25, "Project name should be between 3 and 25 characters"),
  owner: z.number().int().min(1, "Please set a project owner"),
  budget: z.string().regex(new RegExp(/^[1-9][0-9]*$/), "Please provide a budget"),
  date: z.coerce.date(),
  enddate: z.coerce.date().optional(),
  billable: z.any(),
  interval: z.number().int("Please select a interval"),
});

interface NewProjectFormProps {
  team: string;
  clients: Client[];
  users: AllUsersWithAllocation[];
}

export function NewProjectForm({ team, clients, users }: NewProjectFormProps) {
  const router = useRouter();

  const SheetCloseButton = useRef<HTMLButtonElement>(null);
  const [isOngoing, setOngoing] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const intervalList = Object.values(ProjectInterval).map((value, i) => ({ id: i, name: value }));

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch("/api/team/project/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        budget: Number(values.budget),
        team: team,
        name: values.project,
        clientId: values.client,
        ownerId: values.owner,
        startDate: new Date(values.date),
        endDate: values.enddate ? new Date(values.enddate) : null,
        interval: intervalList[values.interval].name,
        billable: values.billable,
      }),
    });

    if (!response?.ok) {
      return toast.error("Something went wrong");
    }

    form.reset();
    SheetCloseButton.current?.click();
    toast.success("A new Project was created");
    router.refresh();
  }

  const handleOpenChange = (e: boolean) => e && form.reset();

  return (
    <Sheet onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button>Add</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <Form {...form}>
          <SheetHeader>
            <SheetTitle>Add a new Project</SheetTitle>
            <SheetDescription>Make it unique and identifiale for your team.</SheetDescription>
          </SheetHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="my-2 flex flex-col gap-y-1">
            <FormField
              control={form.control}
              name="project"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Project name</FormLabel>
                  <FormControl className="mt-2">
                    <Input placeholder="Project Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Client</FormLabel>
                  <FormControl className="mt-2">
                    <InlineCombobox
                      label="Client"
                      options={clients}
                      setVal={form.setValue}
                      fieldName="client"
                      icon={<User className="mr-2 h-4 w-4 shrink-0 opacity-50" />}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="owner"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Owner</FormLabel>
                  <FormControl className="mt-2">
                    <InlineCombobox
                      label="Owner"
                      options={users}
                      setVal={form.setValue}
                      fieldName="owner"
                      icon={<User className="mr-2 h-4 w-4 shrink-0 opacity-50" />}
                    />
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
                    <CalendarDateRangePicker setVal={form.setValue} setOngoing={setOngoing} isOngoing={isOngoing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interval"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Interval</FormLabel>
                  <FormControl className="mt-2">
                    <InlineCombobox
                      label="Interval"
                      options={intervalList}
                      setVal={form.setValue}
                      fieldName="interval"
                      icon={<Activity className="mr-2 h-4 w-4 shrink-0 opacity-50" />}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Budget</FormLabel>
                  <FormControl className="mt-2">
                    <Input placeholder="Budget" {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billable"
              render={({ field }) => (
                <FormItem className="col-span-2 mb-4 flex items-center gap-x-2">
                  <FormLabel htmlFor="billable" className="cursor-pointer">
                    Billable
                  </FormLabel>
                  <FormControl className="my-2">
                    <Input placeholder="billable" {...field} type="checkbox" id="billable" className="h-4 w-4 p-0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="gap-x-4">
              <Button type="submit">Submit</Button>
              <SheetClose asChild>
                <Button type="submit" variant="outline" ref={SheetCloseButton}>
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