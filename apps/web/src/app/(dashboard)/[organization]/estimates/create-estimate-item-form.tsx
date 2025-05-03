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
import { Loader2 } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";
import { authClient } from "@/lib/auth-client";

interface CreateEstimateItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  estimateId: number;
}

export function CreateEstimateItemForm({ open, onOpenChange, onSuccess, estimateId }: CreateEstimateItemFormProps) {
  const createMutation = useMutation(trpc.estimate.createItem.mutationOptions());

  const { data: positions } = useQuery({
    ...trpc.position.getAll.queryOptions(),
    placeholderData: [],
  });

  const form = useForm({
    defaultValues: {
      positionId: "",
      duration: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const activeMember = await authClient.organization.getActiveMember();
        if (!activeMember?.data?.id) {
          toast.error("You must be authenticated to create an estimate item");
          return;
        }

        await createMutation.mutateAsync({
          estimateId,
          positionId: Number(value.positionId),
          duration: Number(value.duration),
          memberId: activeMember.data.id,
        });

        toast.success("Estimate item created successfully");
        onSuccess();
        form.reset();
      } catch (error) {
        toast.error("Failed to create estimate item" + error);
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
            <SheetTitle>Add Estimate Item</SheetTitle>
            <SheetDescription>Add a new item to the estimate.</SheetDescription>
          </SheetHeader>
          <div className="p-4 space-y-4">
            <form.Field
              name="positionId"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return "Position is required";
                  return undefined;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <label htmlFor="position">Position</label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value: string) => field.handleChange(value)}
                    disabled={createMutation.isPending}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions?.map((position) => (
                        <SelectItem key={position.id} value={String(position.id)}>
                          {position.name}
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
              name="duration"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return "Duration is required";
                  if (isNaN(Number(value))) return "Duration must be a number";
                  return undefined;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <label htmlFor="duration">Duration (minutes)</label>
                  <Input
                    id="duration"
                    type="number"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter duration in minutes"
                    disabled={createMutation.isPending}
                  />
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
