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
import { CalendarIcon, Loader2 } from "lucide-react";
import { useAppForm, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import { authClient } from "@/lib/auth-client";

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
        form.reset();
      } catch (error) {
        toast.error("Failed to create estimate" + error);
      }
    },
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-4"
        >
          <SheetHeader>
            <SheetTitle>Create New Estimate</SheetTitle>
            <SheetDescription>Create a new estimate for a project.</SheetDescription>
          </SheetHeader>
          <div className="p-4 space-y-4">
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter estimate name"
                      disabled={createMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            </form.Field>

            <form.Field name="description">
              {(field) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter estimate description"
                      disabled={createMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            </form.Field>

            <form.Field
              name="projectId"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return "Project is required";
                  return undefined;
                },
              }}
            >
              {(field) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <FormControl>
                    <Select
                      value={field.state.value}
                      onValueChange={(value: string) => field.handleChange(value)}
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            </form.Field>

            <form.Field
              name="startDate"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return "Start date is required";
                  return undefined;
                },
              }}
            >
              {(field) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            </form.Field>

            <form.Field name="endDate">
              {(field) => (
                <FormItem>
                  <FormLabel>End Date (Optional)</FormLabel>
                  <FormControl>
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            </form.Field>
          </div>

          <SheetFooter>
            <Button type="submit" className="w-full" disabled={createMutation.isPending}>
              {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Estimate"}
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
