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
import { useState } from "react";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";

const formSchema = z.object({
  positionId: z.number(),
  rate: z.string().min(1),
  currency: z.string().default("USD"),
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
      },
    }),
  );

  const form = useForm({
    defaultValues: {
      positionId: 0,
      rate: "",
      currency: "USD",
    },
    onSubmit: async ({ value }) => {
      createRateCard.mutate({
        positionId: value.positionId,
        rate: value.rate,
        currency: value.currency,
        memberId,
      });
    },
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Create Rate Card</SheetTitle>
          <SheetDescription>Add a new rate card for a position.</SheetDescription>
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
                        {position.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            <Button type="submit" disabled={createRateCard.isPending}>
              {createRateCard.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
