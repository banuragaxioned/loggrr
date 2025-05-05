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
import { useAppForm, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-4"
        >
          <SheetHeader>
            <SheetTitle>Create New Project</SheetTitle>
            <SheetDescription>Create a new project to start tracking time.</SheetDescription>
          </SheetHeader>
          <div className="p-4 space-y-4">
            <form.Field
              name="clientId"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return "Client is required";
                  return undefined;
                },
              }}
            >
              {(field) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <FormControl>
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            </form.Field>
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) => {
                  if (!value.trim()) return "Name is required";
                  return undefined;
                },
              }}
            >
              {(field) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter project name"
                      disabled={createMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            </form.Field>
          </div>

          <SheetFooter>
            <Button type="submit" className="w-full" disabled={createMutation.isPending}>
              {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Project"}
            </Button>
            <SheetClose asChild>
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
