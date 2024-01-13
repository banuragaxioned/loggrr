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
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AllocationFrequency } from "@prisma/client";
import { CalendarDateRangePicker } from "@/components/date-picker";
import { InlineCombobox } from "../ui/combobox";
import { AllProjectsWithMembers, AllUsersWithAllocation } from "../../types";
import { Folder, User } from "lucide-react";

export function NewAllocationForm({
  team,
  projects,
  users,
}: {
  team: string;
  projects: AllProjectsWithMembers[];
  users: AllUsersWithAllocation[];
}) {
  const [isOngoing, setOngoing] = useState(false);
  const router = useRouter();

  const SheetCloseButton = useRef<HTMLButtonElement>(null);

  const formSchema = z.object({
    projectId: z.coerce.number().min(1),
    userId: z.coerce.number().min(1),
    date: z.coerce.date(),
    frequency: z.nativeEnum(AllocationFrequency),
    enddate: z.coerce.date().optional(),
    billableTime: z.coerce.number(),
    nonBillableTime: z.coerce.number(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      frequency: AllocationFrequency.DAY,
    },
  });

  const createAllocation = async (values: z.infer<typeof formSchema>) => {
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
    if (!response?.ok) {
      return toast.error("Something went wrong");
    } else {
      toast.success("A new allocation was created");
    }
  };

  const addUser = async (values: z.infer<typeof formSchema>) => {
    const response = await fetch("/api/team/project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        team: team,
        projectId: values.projectId,
        userId: values.userId,
      }),
    });

    return response;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const isUserAdded = !!projects
      .find((project) => project.id === values.projectId)
      ?.users.find((member) => member.id === values.userId);

    if (!isUserAdded) {
      const addUserResponse = await addUser(values);
      if (addUserResponse?.ok) {
        createAllocation(values);
      }
    } else {
      createAllocation(values);
    }

    SheetCloseButton.current?.click();
    router.refresh();
  }

  useEffect(() => {
    if (isOngoing) form.setValue("frequency", "ONGOING");
    else form.setValue("frequency", "DAY");
  }, [isOngoing]);

  const handleOpenChange = (evt: boolean) => {
    if (evt) {
      setOngoing(false);
      form.reset();
    }
  };

  return (
    <Sheet onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button>Add</Button>
      </SheetTrigger>
      <SheetContent side="right">
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
                    <InlineCombobox
                      label="projects"
                      options={projects}
                      setVal={form.setValue}
                      fieldName="projectId"
                      icon={<Folder className="mr-2 h-4 w-4 shrink-0 opacity-50" />}
                    />
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
                    <InlineCombobox
                      label="users"
                      options={users}
                      setVal={form.setValue}
                      fieldName="userId"
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
            <SheetFooter className="mt-2 justify-start space-x-3">
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