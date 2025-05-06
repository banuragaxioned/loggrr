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
import { Loader2, Briefcase } from "lucide-react";
import { useAppForm } from "@/components/ui/form";
import { trpc } from "@/utils/trpc";
import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CURRENCIES, CURRENCY_OPTIONS, type Currency } from "@/constants";

const formSchema = z.object({
  name: z.string().min(2, "Position name must be at least 2 characters long"),
  description: z.string(),
  rate: z.string().min(1, "Rate is required"),
  currency: z.enum(CURRENCIES),
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
        toast.success("Position created successfully");
      },
      onError: () => {
        toast.error("Failed to create position");
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
      rate: "",
      currency: "USD" as Currency,
    },
    validators: { onChange: formSchema },
    onSubmit: async ({ value }) => {
      if (!activeMemberId) {
        toast.error("You must be authenticated to create a position");
        return;
      }

      try {
        await createPosition.mutateAsync({
          name: value.name,
          description: value.description,
          rate: value.rate,
          currency: value.currency,
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
          <SheetTitle>Create Position</SheetTitle>
          <SheetDescription>Add a new position to your organization.</SheetDescription>
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
                      placeholder="e.g. Senior Developer"
                      disabled={createPosition.isPending}
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
                    <Textarea
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. A senior developer with 5+ years of experience"
                      disabled={createPosition.isPending}
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            <form.AppField
              name="rate"
              children={(field) => (
                <field.FormItem className="px-4">
                  <field.FormLabel>Rate</field.FormLabel>
                  <field.FormControl>
                    <Input
                      type="number"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. 100"
                      disabled={createPosition.isPending}
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            <form.AppField
              name="currency"
              children={(field) => (
                <field.FormItem className="px-4">
                  <field.FormLabel>Currency</field.FormLabel>
                  <field.FormControl>
                    <Select
                      value={field.state.value}
                      onValueChange={(value: Currency) => field.handleChange(value)}
                      disabled={createPosition.isPending}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
              <Button type="submit" className="w-full" disabled={createPosition.isPending || !activeMemberId}>
                {createPosition.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Briefcase className="mr-2 h-4 w-4" />
                )}
                Create Position
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
