"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
import { CalendarIcon, Loader2, FileText } from "lucide-react";
import { useAppForm } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import { authClient } from "@/lib/auth-client";
import { useCallback } from "react";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  description: z.string().optional(),
  projectId: z.string().min(1, "Project is required"),
  startDate: z.date(),
  endDate: z.date().optional(),
});

interface CreateEstimateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  projects: { id: number; name: string }[];
}

export function CreateEstimateForm({ open, onOpenChange, onSuccess, projects }: CreateEstimateFormProps) {
  const createMutation = useMutation(
    trpc.estimate.create.mutationOptions({
      onSuccess: () => {
        form.reset();
        onSuccess();
        onOpenChange(false);
        toast.success("Estimate created successfully");
      },
      onError: () => {
        toast.error("Failed to create estimate");
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
      projectId: "",
      startDate: new Date(),
      endDate: undefined as Date | undefined,
    },
    // TODO: Need to fix this any
    validators: { onChange: formSchema as any },
    onSubmit: async ({ value }) => {
      try {
        const response = await authClient.organization.getActiveMember();
        if (!response?.data?.id) {
          toast.error("Not authenticated");
          return;
        }
        await createMutation.mutateAsync({
          name: value.name,
          description: value.description || undefined,
          projectId: Number(value.projectId),
          startDate: value.startDate.toISOString(),
          endDate: value.endDate?.toISOString(),
          memberId: response.data.id,
        });
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
          <SheetTitle>Create New Estimate</SheetTitle>
          <SheetDescription>Create a new estimate for a project.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <form.AppForm>
            <form.AppField
              name="name"
              children={(field) => (
                <field.FormItem className="px-4">
                  <field.FormLabel>Name</field.FormLabel>
                  <field.FormControl>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter estimate name"
                      disabled={createMutation.isPending}
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            <form.AppField
              name="description"
              children={(field) => (
                <field.FormItem className="px-4">
                  <field.FormLabel>Description</field.FormLabel>
                  <field.FormControl>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter estimate description"
                      disabled={createMutation.isPending}
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            <form.AppField
              name="projectId"
              children={(field) => (
                <field.FormItem className="px-4">
                  <field.FormLabel>Project</field.FormLabel>
                  <field.FormControl>
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                      disabled={createMutation.isPending}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={String(project.id)}>
                            {project.name}
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
              name="startDate"
              children={(field) => (
                <field.FormItem className="px-4">
                  <field.FormLabel>Start Date</field.FormLabel>
                  <field.FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.state.value && "text-muted-foreground",
                          )}
                          disabled={createMutation.isPending}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.state.value ? format(field.state.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.state.value}
                          onSelect={(date: Date | undefined) => date && field.handleChange(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            <form.AppField
              name="endDate"
              children={(field) => (
                <field.FormItem className="px-4">
                  <field.FormLabel>End Date (Optional)</field.FormLabel>
                  <field.FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.state.value && "text-muted-foreground",
                          )}
                          disabled={createMutation.isPending}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.state.value ? format(field.state.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.state.value}
                          onSelect={(date: Date | undefined) => date && field.handleChange(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                  <FileText className="mr-2 h-4 w-4" />
                )}
                Create Estimate
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
