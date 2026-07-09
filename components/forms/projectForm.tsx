"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Activity, Briefcase, Coins, Loader2, User } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";

import { ProjectInterval } from "@/generated/prisma/browser";
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

export function NewProjectForm({ team, clients, users }: NewProjectFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit_id");

  const [open, setOpen] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState<{ id: number; name: string } | null>(null);
  const [selectedOwner, setSelectedOwner] = useState<AllUsersWithAllocation | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [billable, setBillable] = useState(false);
  const [loading, setLoading] = useState(false);

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
    const response = await fetch("/api/team/project", {
      method: editId ? "PUT" : "POST",
      body: JSON.stringify({
        id: editId,
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
      const error = await response.json();
      return toast.error(error.error || `Unable to ${editId ? "update" : "create"} project. Please try again later.`);
    }

    if (response.ok) {
      toast.success(`${values.project} ${editId ? "updated" : "created"} successfully!`);
      resetForm();
      setOpen(false);
      // Preserve all query params except edit_id
      const params = new URLSearchParams(searchParams.toString());
      params.delete("edit_id");
      router.replace(params.toString() ? `?${params.toString()}` : "?");
      router.refresh();
    }
  }

  const resetForm = () => {
    form.reset();
    setSelectedClient(null);
    setSelectedOwner(null);
    setSelectedInterval(null);
    setBillable(false);
  };

  const handleClients = (selected: string) => {
    const clientValue = clients.find((client) => client.id === +selected);
    setSelectedClient(clientValue ?? null);
    form.setValue("client", clientValue?.id ?? 0);
  };

  const handleOwners = (selected: string) => {
    const ownerValue = users.find((user) => user.id === +selected);
    setSelectedOwner(ownerValue ?? null);
    form.setValue("owner", ownerValue?.id ?? 0);
  };

  const handleInterval = (selected: string) => {
    const intervalValue = intervalList.find((obj) => obj.id === +selected);
    setSelectedInterval(intervalValue ?? null);
    form.setValue("interval", intervalValue?.id ?? 0);
  };

  useEffect(() => {
    const fetchProject = async () => {
      if (editId) {
        setOpen(true);
        setLoading(true);
        const response = await fetch(`/api/team/project?id=${editId}&team=${team}`);
        const data = await response.json();
        setSelectedClient(clients.find((client) => client.id === data.clientId) ?? null);
        setSelectedOwner(users.find((user) => user.id === data.ownerId) ?? null);
        setSelectedInterval(intervalList.find((interval) => interval.name === data.interval) ?? null);
        setBillable(data.billable);
        form.setValue("project", data.name);
        form.setValue("client", data.clientId);
        form.setValue("owner", data.ownerId);
        form.setValue("interval", intervalList.find((interval) => interval.name === data.interval)?.id ?? 0);
        form.setValue("billable", data.billable);
        form.setValue("budget", data.budget);
        setLoading(false);
      }
    };
    if (editId) {
      fetchProject();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId, team]);

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
          // Preserve all query params except edit_id
          const params = new URLSearchParams(searchParams.toString());
          params.delete("edit_id");
          router.replace(params.toString() ? `?${params.toString()}` : "?");
        }
        setOpen(open);
      }}
    >
      <SheetTrigger asChild>
        <Button className="flex gap-2" size="sm">
          Create
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex h-full flex-col gap-0 px-0">
        {loading && (
          <div className="bg-background/70 absolute inset-0 z-10 flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        )}
        <Form {...form}>
          <SheetHeader className="shrink-0 border-b px-6 pb-4">
            <SheetTitle className="text-xl tracking-normal">{editId ? "Edit project" : "Create project"}</SheetTitle>
            <SheetDescription className="text-xs tracking-normal">
              {editId
                ? "Update project details, ownership, and billing settings."
                : "Set up project details, ownership, and billing settings."}
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col" autoComplete="off">
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
              <section className="space-y-4">
                <FormField
                  control={form.control}
                  name="project"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project name</FormLabel>
                      <FormControl className="mt-1.5">
                        <Input placeholder="e.g. Mobile App Revamp" {...field} autoComplete="off" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="client"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <FormControl className="mt-1.5">
                        <ComboBox
                          searchable
                          icon={<Briefcase size={16} />}
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
                    <FormItem>
                      <FormLabel>Owner</FormLabel>
                      <FormControl className="mt-1.5">
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
              </section>

              <section className="space-y-4 border-t pt-5">
                <div>
                  <h3 className="text-sm font-semibold tracking-normal">Billing & Budget</h3>
                </div>
                <FormField
                  control={form.control}
                  name="interval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interval</FormLabel>
                      <FormControl className="mt-1.5">
                        <ComboBox
                          searchable
                          icon={<Activity size={16} />}
                          options={intervalList}
                          label="Interval"
                          selectedItem={selectedInterval}
                          handleSelect={(selected) => handleInterval(selected)}
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
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget (hours)</FormLabel>
                      <FormControl className="mt-1.5">
                        <Input
                          placeholder="e.g. 160"
                          {...field}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          prefix="hour"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="billable"
                  render={({ field }) => (
                    <FormItem className="bg-muted/20 rounded-md border p-3">
                      <FormControl>
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="billable"
                            checked={billable}
                            onCheckedChange={(checked) => {
                              const nextValue = Boolean(checked);
                              setBillable(nextValue);
                              form.setValue("billable", nextValue);
                            }}
                            className="mt-0.5"
                          />
                          <div className="space-y-0.5">
                            <FormLabel
                              htmlFor="billable"
                              className="cursor-pointer text-sm font-medium tracking-normal"
                            >
                              Billable project
                            </FormLabel>
                            <p className="text-muted-foreground text-xs tracking-normal">
                              Enable this when project hours should be counted as billable.
                            </p>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>
            </div>
            <SheetFooter className="bg-background shrink-0 border-t px-6 py-4">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit" className="gap-2">
                <Coins size={16} />
                {editId ? "Save changes" : "Create project"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
