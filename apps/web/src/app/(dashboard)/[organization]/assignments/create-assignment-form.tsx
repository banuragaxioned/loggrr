"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Loader2, UserPlus } from "lucide-react";
import { useAppForm } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useCallback } from "react";
import { formatMinutesToHours } from "@/lib/duration";
import { z } from "zod";

const formSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  memberId: z.string().min(1, "Member is required"),
  estimateId: z.string().min(1, "Estimate is required"),
  estimateItemId: z.string().min(1, "Estimate item is required"),
});

interface Member {
  id: string;
  organizationId: string;
  userId: string;
  role: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

interface CreateAssignmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateAssignmentForm({ open, onOpenChange, onSuccess }: CreateAssignmentFormProps) {
  const [selectedEstimateId, setSelectedEstimateId] = useState<string>("");
  const createMutation = useMutation(trpc.assignment.create.mutationOptions());
  const projects = useQuery({
    ...trpc.project.getAll.queryOptions(),
    placeholderData: [],
  });
  const members = useQuery({
    ...trpc.member.getAll.queryOptions(),
    placeholderData: [],
  });
  const estimates = useQuery({
    ...trpc.estimate.getAll.queryOptions(),
    placeholderData: [],
  });
  const estimateItems = useQuery({
    ...trpc.estimate.getItems.queryOptions({ estimateId: Number(selectedEstimateId) }),
    enabled: !!selectedEstimateId,
    placeholderData: [],
  });

  const form = useAppForm({
    defaultValues: {
      projectId: "",
      memberId: "",
      estimateId: "",
      estimateItemId: "",
    },
    validators: { onChange: formSchema },
    onSubmit: async ({ value }) => {
      try {
        const activeMember = await authClient.organization.getActiveMember();
        if (!activeMember?.data?.id) {
          toast.error("You must be authenticated to create an assignment");
          return;
        }

        await createMutation.mutateAsync({
          projectId: Number(value.projectId),
          memberId: value.memberId,
          estimateItemId: Number(value.estimateItemId),
        });

        toast.success("Assignment created successfully");
        onSuccess();
        form.reset();
      } catch (error) {
        toast.error("Failed to create assignment");
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
          <SheetTitle>Create Assignment</SheetTitle>
          <SheetDescription>Assign a member to an estimate item for a project.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <form.AppForm>
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
                        {projects.data?.map((project) => (
                          <SelectItem key={project.id} value={project.id.toString()}>
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
              name="memberId"
              children={(field) => (
                <field.FormItem className="px-4">
                  <field.FormLabel>Member</field.FormLabel>
                  <field.FormControl>
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                      disabled={createMutation.isPending}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a member" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.data?.map((member: Member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.user.name ?? "Unnamed User"}
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
              name="estimateId"
              children={(field) => (
                <field.FormItem className="px-4">
                  <field.FormLabel>Estimate</field.FormLabel>
                  <field.FormControl>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) => {
                        field.handleChange(value);
                        setSelectedEstimateId(value);
                      }}
                      disabled={createMutation.isPending}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an estimate" />
                      </SelectTrigger>
                      <SelectContent>
                        {estimates.data?.map((estimate) => (
                          <SelectItem key={estimate.id} value={estimate.id.toString()}>
                            {estimate.name}
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
              name="estimateItemId"
              children={(field) => (
                <field.FormItem className="px-4">
                  <field.FormLabel>Estimate Item</field.FormLabel>
                  <field.FormControl>
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                      disabled={createMutation.isPending || !selectedEstimateId}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an estimate item" />
                      </SelectTrigger>
                      <SelectContent>
                        {estimateItems.data?.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.positionName} - {formatMinutesToHours(item.duration)}h
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  <UserPlus className="mr-2 h-4 w-4" />
                )}
                Create Assignment
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
