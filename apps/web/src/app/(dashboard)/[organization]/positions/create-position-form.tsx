"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  rate: z.string().min(1),
  currency: z.string().default("USD"),
});

interface CreatePositionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreatePositionForm({ open, onOpenChange, onSuccess }: CreatePositionFormProps) {
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

  const createPosition = useMutation(
    trpc.position.create.mutationOptions({
      onSuccess: () => {
        form.reset();
        onSuccess();
        onOpenChange(false);
      },
    }),
  );

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      rate: "",
      currency: "USD",
    },
    onSubmit: async ({ value }) => {
      if (!activeMemberId) {
        toast.error("You must be authenticated to create a position");
        return;
      }

      createPosition.mutate({
        name: value.name,
        description: value.description,
        rate: value.rate,
        currency: value.currency,
        memberId: activeMemberId,
      });
    },
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Create Position</SheetTitle>
          <SheetDescription>Add a new position to your organization.</SheetDescription>
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
            name="name"
            children={(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. Senior Developer"
                />
              </div>
            )}
          />
          <form.Field
            name="description"
            children={(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. A senior developer with 5+ years of experience"
                />
              </div>
            )}
          />
          <form.Field
            name="rate"
            children={(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium">Rate</label>
                <Input
                  type="number"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. 100"
                />
              </div>
            )}
          />
          <form.Field
            name="currency"
            children={(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium">Currency</label>
                <Select onValueChange={(value) => field.handleChange(value)} defaultValue={field.state.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button type="submit" disabled={createPosition.isPending || !activeMemberId}>
              {createPosition.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
