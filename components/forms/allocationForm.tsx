"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Folder, User } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { AllocationFrequency } from "@prisma/client";
import { CalendarDateRangePicker } from "@/components/date-picker";
import { ComboBox } from "../ui/combobox";
import { AllProjectsWithMembers, AllUsersWithAllocation } from "../../types";

export function NewAllocationForm({
  team,
  projects,
  users,
}: {
  team: string;
  projects: AllProjectsWithMembers[];
  users: AllUsersWithAllocation[];
}) {
  const router = useRouter();
  const [isOngoing, setOngoing] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const SheetCloseButton = useRef<HTMLButtonElement>(null);

  const formSchema = z.object({
    projectId: z.coerce.number().min(1),
    userId: z.coerce.number().min(1),
    startDate: z.coerce.date(),
    frequency: z.nativeEnum(AllocationFrequency),
    endDate: z.coerce.date().optional(),
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
      body: JSON.stringify({
        projectId: values.projectId,
        userId: values.userId,
        startDate: values.startDate,
        frequency: values.frequency,
        endDate: values?.endDate,
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

  const handleProjects = (selected: string) => {
    const projectValue = projects.find((obj) => obj.id === +selected);
    setSelectedProject(projectValue);
    form.setValue("projectId", projectValue?.id ?? 0);
  };

  const handleUsers = (selected: string) => {
    const user = users.find((obj) => obj.id === +selected);
    setSelectedUser(user);
    form.setValue("userId", user?.id ?? 0);
  };

  const handleOpenChange = (evt: boolean) => {
    if (evt) {
      setOngoing(false);
      form.reset();
      setSelectedProject(null);
      setSelectedUser(null);
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
                    <ComboBox
                      searchable
                      icon={<Folder size={16} />}
                      options={projects}
                      label="Projects"
                      selectedItem={selectedProject}
                      handleSelect={(selected) => handleProjects(selected)}
                      {...field}
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
                    <ComboBox
                      searchable
                      icon={<User size={16} />}
                      options={users}
                      label="Users"
                      selectedItem={selectedUser}
                      handleSelect={(selected) => handleUsers(selected)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Duration</FormLabel>
                  <FormControl className="mt-2">
                    <CalendarDateRangePicker
                      setVal={form.setValue}
                      setOngoing={setOngoing}
                      isOngoing={isOngoing}
                      startDate={field.value}
                      endDate={form.getValues().endDate}
                      {...field}
                    />
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
