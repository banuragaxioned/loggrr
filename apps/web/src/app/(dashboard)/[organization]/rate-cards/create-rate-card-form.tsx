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
import { Loader2, CreditCard } from "lucide-react";
import { useAppForm } from "@/components/ui/form";
import { trpc } from "@/utils/trpc";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { CURRENCIES, CURRENCY_OPTIONS, type Currency } from "@/constants";
import { toast } from "sonner";

const formSchema = z.object({
  positionId: z.number(),
  rate: z.string().min(1, "Rate is required"),
  currency: z.enum(CURRENCIES),
});

interface Position {
  id: number;
  name: string;
  description: string | null;
}

interface CreateRateCardFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  memberId: string;
}

export function CreateRateCardForm({ open, onOpenChange, onSuccess, memberId }: CreateRateCardFormProps) {
  const positions = useQuery({
    ...trpc.position.getAll.queryOptions(),
    placeholderData: [],
  });

  const createRateCard = useMutation(
    trpc.position.createRateCard.mutationOptions({
      onSuccess: () => {
        form.reset();
        onSuccess();
        onOpenChange(false);
        toast.success("Rate card created successfully");
      },
      onError: () => {
        toast.error("Failed to create rate card");
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      positionId: 0,
      rate: "",
      currency: "USD" as Currency,
    },
    validators: { onChange: formSchema },
    onSubmit: async ({ value }) => {
      try {
        await createRateCard.mutateAsync({
          positionId: value.positionId,
          rate: value.rate,
          currency: value.currency,
          memberId,
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
          <SheetTitle>Create Rate Card</SheetTitle>
          <SheetDescription>Add a new rate card for a position.</SheetDescription>
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
                      disabled={createRateCard.isPending}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a position" />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.data?.map((position: Position) => (
                          <SelectItem key={position.id} value={position.id.toString()}>
                            {position.name}
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
                      disabled={createRateCard.isPending}
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
                      disabled={createRateCard.isPending}
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
              <Button type="submit" className="w-full" disabled={createRateCard.isPending}>
                {createRateCard.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="mr-2 h-4 w-4" />
                )}
                Create Rate Card
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
