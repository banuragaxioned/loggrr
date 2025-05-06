"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAppForm } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { Loader2, FolderPlus } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";
import { useCallback } from "react";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters long"),
  clientId: z.string().min(1, "Client is required"),
});

interface CreateProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  clients: { id: number; name: string }[];
}

export function CreateProjectForm({ open, onOpenChange, onSuccess, clients }: CreateProjectFormProps) {
  const createMutation = useMutation(
    trpc.project.create.mutationOptions({
      onSuccess: () => {
        onSuccess();
        onOpenChange(false);
        toast.success("Project created successfully");
      },
      onError: () => {
        toast.error("Failed to create project");
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      name: "",
      clientId: "",
    },
    validators: { onChange: formSchema },
    onSubmit: async ({ value }) => {
      try {
        await createMutation.mutateAsync({
          name: value.name,
          clientId: parseInt(value.clientId),
        });
        form.reset();
      } catch (error) {
        // Error is handled by mutation
      }
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form],
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Create New Project</SheetTitle>
          <SheetDescription>Create a new project to start tracking time.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <form.AppForm>
            <form.AppField
              name="clientId"
              children={(field) => (
                <field.FormItem className="px-4">
                  <field.FormLabel>Client</field.FormLabel>
                  <field.FormControl>
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                      disabled={createMutation.isPending}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            <form.AppField
              name="name"
              children={(field) => (
                <field.FormItem className="px-4">
                  <field.FormLabel>Project Name</field.FormLabel>
                  <field.FormControl>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter project name"
                      disabled={createMutation.isPending}
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            <SheetFooter>
              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FolderPlus className="mr-2 h-4 w-4" />
                )}
                Create Project
              </Button>
              <SheetClose asChild>
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </SheetClose>
            </SheetFooter>
          </form.AppForm>
        </form>
      </SheetContent>
    </Sheet>
  );
}
