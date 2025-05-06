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
import { Loader2, ListPlus } from "lucide-react";
import { useAppForm } from "@/components/ui/form";
import { trpc } from "@/utils/trpc";
import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/currency";

const formSchema = z.object({
  positionId: z.number().min(1, "Position is required"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
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
        toast.success("Estimate item created successfully");
      },
      onError: () => {
        toast.error("Failed to create estimate item");
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      positionId: 0,
      duration: 0,
    },
    validators: { onChange: formSchema },
    onSubmit: async ({ value }) => {
      if (!activeMemberId) {
        toast.error("You must be authenticated to create an estimate item");
        return;
      }

      try {
        await createEstimateItem.mutateAsync({
          estimateId,
          positionId: value.positionId,
          duration: value.duration,
          memberId: activeMemberId,
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
          <SheetTitle>Create Estimate Item</SheetTitle>
          <SheetDescription>Add a new item to your estimate.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <form.AppForm>
            <form.AppField
              name="positionId"
              children={(field) => (
                <field.FormItem className="px-4">
                  <field.FormLabel>Position</field.FormLabel>
                  <field.FormControl>
                    <Select
                      value={field.state.value.toString()}
                      onValueChange={(value) => field.handleChange(Number(value))}
                      disabled={createEstimateItem.isPending}
                    >
                      <SelectTrigger className="w-full">
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
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            <form.AppField
              name="duration"
              children={(field) => (
                <field.FormItem className="px-4">
                  <field.FormLabel>Duration (minutes)</field.FormLabel>
                  <field.FormControl>
                    <Input
                      type="number"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      disabled={createEstimateItem.isPending}
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            <SheetFooter>
              <Button type="submit" className="w-full" disabled={createEstimateItem.isPending || !activeMemberId}>
                {createEstimateItem.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ListPlus className="mr-2 h-4 w-4" />
                )}
                Create Estimate Item
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
