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
import { Loader2 } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { formatMinutesToHours } from "@/lib/duration";
import { formatCurrency } from "@/lib/currency";

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

  const form = useForm({
    defaultValues: {
      projectId: "",
      memberId: "",
      estimateId: "",
      estimateItemId: "",
    },
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
            <SheetTitle>Create Assignment</SheetTitle>
            <SheetDescription>Assign a member to an estimate item for a project.</SheetDescription>
          </SheetHeader>
          <div className="p-4 space-y-4">
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
                <div className="space-y-2">
                  <label htmlFor="projectId">Project</label>
                  <Select
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    disabled={createMutation.isPending}
                  >
                    <SelectTrigger>
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
                  {field.state.meta.errors ? (
                    <p className="text-sm text-destructive">{field.state.meta.errors}</p>
                  ) : null}
                </div>
              )}
            </form.Field>

            <form.Field
              name="memberId"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return "Member is required";
                  return undefined;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <label htmlFor="memberId">Member</label>
                  <Select
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    disabled={createMutation.isPending}
                  >
                    <SelectTrigger>
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
                  {field.state.meta.errors ? (
                    <p className="text-sm text-destructive">{field.state.meta.errors}</p>
                  ) : null}
                </div>
              )}
            </form.Field>

            <form.Field
              name="estimateId"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return "Estimate is required";
                  return undefined;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <label htmlFor="estimateId">Estimate</label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => {
                      field.handleChange(value);
                      setSelectedEstimateId(value);
                    }}
                    disabled={createMutation.isPending}
                  >
                    <SelectTrigger>
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
                  {field.state.meta.errors ? (
                    <p className="text-sm text-destructive">{field.state.meta.errors}</p>
                  ) : null}
                </div>
              )}
            </form.Field>

            <form.Field
              name="estimateItemId"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return "Estimate item is required";
                  return undefined;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <label htmlFor="estimateItemId">Estimate Item</label>
                  <Select
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    disabled={createMutation.isPending || !selectedEstimateId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an estimate item" />
                    </SelectTrigger>
                    <SelectContent>
                      {estimateItems.data?.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.skillName} - {formatMinutesToHours(item.duration)}h @{" "}
                          {formatCurrency(item.rate, item.currency)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {field.state.meta.errors ? (
                    <p className="text-sm text-destructive">{field.state.meta.errors}</p>
                  ) : null}
                </div>
              )}
            </form.Field>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
