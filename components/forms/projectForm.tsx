"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Activity, Plus, User, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
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
import { ComboBox } from "../ui/combobox";
import { CalendarDateRangePicker } from "@/components/date-picker";
import { ProjectInterval } from "@prisma/client";
import { Client, AllUsersWithAllocation } from "@/types";

const formSchema = z.object({
  client: z.number().int().min(1, "Please select a client"),
  project: z.string().min(3).max(50, "Project name should be between 3 and 50 characters"),
  owner: z.number().int().min(1, "Please set a project owner"),
  budget: z.union([z.string(), z.number()]).optional(),
  billable: z.any(),
  interval: z.number().int("Please select a interval"),
});

interface NewProjectFormProps {
  team: string;
  clients: Client[];
  users: AllUsersWithAllocation[];
}

interface EditProjectFormProps {
  team: string;
  clients: Client[];
  users: AllUsersWithAllocation[];
  projectDetails: {
    id: number;
    budget: number;
    team: string;
    name: string;
    clientId: number;
    owner: string;
    interval: number;
    billable: boolean;
  };
}

export function NewProjectForm({ team, clients, users }: NewProjectFormProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState<any>(null);
  const [selectedOwner, setSelectedOwner] = useState<any>(null);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client: 0,
      project: "",
      owner: 0,
      budget: "",
      billable: false,
      interval: 0,
    },
  });

  const intervalList = Object.values(ProjectInterval).map((value, i) => ({ id: i, name: value }));

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch("/api/team/project/add", {
      method: "POST",
      body: JSON.stringify({
        budget: Number(values.budget),
        team: team,
        name: values.project,
        clientId: values.client,
        ownerId: values.owner,
        interval: intervalList[values.interval].name,
        billable: values.billable,
      }),
    });

    if (!response?.ok) {
      return toast.error("Unable to create project. Please try again later.");
    }

    toast.success(`${values.project} created successfully!`);
    form.reset();
    setOpen(false);
    router.refresh();
  }

  const handleClients = (selected: string) => {
    const clientValue = clients.find((client) => client.id === +selected);
    setSelectedClient(clientValue);
    form.setValue("client", clientValue?.id ?? 0);
  };

  const handleOwners = (selected: string) => {
    const ownerValue = users.find((user) => user.id === +selected);
    setSelectedOwner(ownerValue);
    form.setValue("owner", ownerValue?.id ?? 0);
  };

  const handleInterval = (selected: string) => {
    const intervalValue = intervalList.find((obj) => obj.id === +selected);
    setSelectedInterval(intervalValue);
    form.setValue("interval", intervalValue?.id ?? 0);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="flex gap-2" size="sm">
          Create
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="h-full overflow-y-auto">
        <Form {...form}>
          <SheetHeader>
            <SheetTitle>Create a new Project</SheetTitle>
            <SheetDescription>Make it unique and identifiale for your team.</SheetDescription>
          </SheetHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="my-2 flex flex-col gap-y-1" autoComplete="off">
            <FormField
              control={form.control}
              name="project"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Project name</FormLabel>
                  <FormControl className="mt-2">
                    <Input placeholder="Project Name" {...field} autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem className="w-full-combo col-span-2">
                  <FormLabel>Client</FormLabel>
                  <FormControl className="mt-2">
                    <ComboBox
                      searchable
                      icon={<User size={16} />}
                      options={clients}
                      label="Client"
                      selectedItem={selectedClient}
                      handleSelect={(selected) => handleClients(selected)}
                      {...field}
                      className="-mt-1 w-full max-w-full"
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
                <FormItem className="w-full-combo col-span-2">
                  <FormLabel>Owner</FormLabel>
                  <FormControl className="mt-2">
                    <ComboBox
                      searchable
                      icon={<User size={16} />}
                      options={users}
                      label="Owner"
                      selectedItem={selectedOwner}
                      handleSelect={(selected) => handleOwners(selected)}
                      {...field}
                      className="-mt-1 w-full max-w-full"
                    />
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
                    <ComboBox
                      searchable
                      icon={<Activity size={16} />}
                      options={intervalList}
                      label="Interval"
                      selectedItem={selectedInterval}
                      handleSelect={(selected) => handleInterval(selected)}
                      {...field}
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
                    <Input placeholder="Budget" {...field} type="text" inputMode="numeric" pattern="[0-9]*" />
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
                  <FormControl>
                    <Input
                      placeholder="billable"
                      {...field}
                      type="checkbox"
                      id="billable"
                      className="mt-2 h-4 w-4 p-0 accent-current"
                    />
                  </FormControl>
                  <FormLabel htmlFor="billable" className="mt-0 cursor-pointer">
                    Billable
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit">Submit</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export function EditProjectForm({ team, clients, users, projectDetails }: EditProjectFormProps) {
  const router = useRouter();
  const intervalList = Object.values(ProjectInterval).map((value, i) => ({ id: i, name: value }));
  const [open, setOpen] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState<any>(intervalList.find(interval => interval.id === projectDetails.interval));
  const [selectedOwner, setSelectedOwner] = useState<any>(users.find(user => user.name === projectDetails.owner));
  const [selectedClient, setSelectedClient] = useState<any>(clients.find(client => client.id === projectDetails.clientId));
  const [projectName, setProjectName] = useState<string>(projectDetails.name);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client: selectedClient || 0,
      project: projectName || "",
      owner: selectedOwner || 0,
      budget: projectDetails.budget || "",
      billable: projectDetails.billable || false,
      interval: selectedInterval || 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch("/api/team/project/add", {
      method: "PUT",
      body: JSON.stringify({
        id: projectDetails.id,
        budget: Number(values.budget),
        team: team,
        name: values.project,
        clientId: values.client,
        ownerId: values.owner,
        interval: intervalList[values.interval].name,
        billable: values.billable,
      }),
    });

    if (!response?.ok) {
      return toast.error("Unable to create project. Please try again later.");
    }

    toast.success(`${values.project} created successfully!`);
    form.reset();
    setOpen(false);
    router.refresh();
  }

  const handleClients = (selected: string) => {
    const clientValue = clients.find((client) => client.id === +selected);
    setSelectedClient(clientValue);
    form.setValue("client", clientValue?.id ?? 0);
  };

  const handleOwners = (selected: string) => {
    const ownerValue = users.find((user) => user.id === +selected);
    setSelectedOwner(ownerValue);
    form.setValue("owner", ownerValue?.id ?? 0);
  };

  const handleInterval = (selected: string) => {
    const intervalValue = intervalList.find((obj) => obj.id === +selected);
    setSelectedInterval(intervalValue);
    form.setValue("interval", intervalValue?.id ?? 0);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="ghost">
          <Edit size={16} className="mr-2" />
          Edit
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="h-full overflow-y-auto">
        <Form {...form}>
          <SheetHeader>
            <SheetTitle>Edit Project</SheetTitle>
            <SheetDescription>Keep it unique and identifiale for your team.</SheetDescription>
          </SheetHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="my-2 flex flex-col gap-y-1" autoComplete="off">
            <FormField
              control={form.control}
              name="project"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Project name</FormLabel>
                  <FormControl className="mt-2">
                    <Input placeholder="Project Name" {...field} autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem className="w-full-combo col-span-2">
                  <FormLabel>Client</FormLabel>
                  <FormControl className="mt-2">
                    <ComboBox
                      searchable
                      icon={<User size={16} />}
                      options={clients}
                      label="Client"
                      selectedItem={selectedClient}
                      handleSelect={(selected) => handleClients(selected)}
                      {...field}
                      className="-mt-1 w-full max-w-full"
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
                <FormItem className="w-full-combo col-span-2">
                  <FormLabel>Owner</FormLabel>
                  <FormControl className="mt-2">
                    <ComboBox
                      searchable
                      icon={<User size={16} />}
                      options={users}
                      label="Owner"
                      selectedItem={selectedOwner}
                      handleSelect={(selected) => handleOwners(selected)}
                      {...field}
                      className="-mt-1 w-full max-w-full"
                    />
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
                    <ComboBox
                      searchable
                      icon={<Activity size={16} />}
                      options={intervalList}
                      label="Interval"
                      selectedItem={selectedInterval}
                      handleSelect={(selected) => handleInterval(selected)}
                      {...field}
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
                    <Input placeholder="Budget" {...field} type="text" inputMode="numeric" pattern="[0-9]*" />
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
                  <FormControl>
                    <Input
                      placeholder="billable"
                      {...field}
                      type="checkbox"
                      id="billable"
                      className="mt-2 h-4 w-4 p-0 accent-current"
                    />
                  </FormControl>
                  <FormLabel htmlFor="billable" className="mt-0 cursor-pointer">
                    Billable
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit">Submit</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
