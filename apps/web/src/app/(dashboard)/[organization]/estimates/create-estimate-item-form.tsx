"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { trpc } from "@/utils/trpc";
import { useState, useEffect } from "react";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/currency";

const formSchema = z.object({
  positionId: z.number(),
  duration: z.number().min(1),
});

interface Position {
  id: number;
  name: string;
  description: string | null;
  rate: string;
  currency: string;
}

interface CreateEstimateItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  estimateId: number;
}

export function CreateEstimateItemForm({ open, onOpenChange, onSuccess, estimateId }: CreateEstimateItemFormProps) {
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActiveMember() {
      try {
        const activeMember = await authClient.organization.getActiveMember();
        if (activeMember?.data?.id) {
          setActiveMemberId(activeMember.data.id);
        }
      } catch (error) {
        console.error("Failed to fetch active member:", error);
        toast.error("Failed to fetch active member");
      }
    }
    fetchActiveMember();
  }, []);

  const positions = useQuery({
    ...trpc.position.getAll.queryOptions(),
    placeholderData: [],
  });

  const createEstimateItem = useMutation(
    trpc.estimate.createItem.mutationOptions({
      onSuccess: () => {
        form.reset();
        onSuccess();
        onOpenChange(false);
      },
    }),
  );

  const form = useForm({
    defaultValues: {
      positionId: 0,
      duration: 0,
    },
    onSubmit: async ({ value }) => {
      if (!activeMemberId) {
        toast.error("You must be authenticated to create an estimate item");
        return;
      }

      createEstimateItem.mutate({
        estimateId,
        positionId: value.positionId,
        duration: value.duration,
        memberId: activeMemberId,
      });
    },
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Create Estimate Item</SheetTitle>
          <SheetDescription>Add a new item to your estimate.</SheetDescription>
        </SheetHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="positionId"
            children={(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium">Position</label>
                <Select
                  onValueChange={(value) => field.handleChange(Number(value))}
                  defaultValue={field.state.value.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.data?.map((position: Position) => (
                      <SelectItem key={position.id} value={position.id.toString()}>
                        {position.name} ({formatCurrency(position.rate, position.currency)}/hr)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />
          <form.Field
            name="duration"
            children={(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (minutes)</label>
                <Input
                  type="number"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                />
              </div>
            )}
          />
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button type="submit" disabled={createEstimateItem.isPending || !activeMemberId}>
              {createEstimateItem.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
