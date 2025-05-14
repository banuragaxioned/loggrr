"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAppForm } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { Briefcase, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";
import { useCallback } from "react";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Client name must be at least 2 characters long"),
});

interface CreateClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateClientForm({ open, onOpenChange, onSuccess }: CreateClientFormProps) {
  const createMutation = useMutation(
    trpc.client.create.mutationOptions({
      onSuccess: () => {
        onSuccess();
        onOpenChange(false);
        toast.success("Client created successfully");
      },
      onError: () => {
        toast.error("Failed to create client");
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      name: "",
    },
    validators: { onChange: formSchema },
    onSubmit: async ({ value }) => {
      try {
        await createMutation.mutateAsync({ name: value.name });
        form.reset();
      } catch (error) {
        toast.error("Failed to create client");
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
          <SheetTitle>Create New Client</SheetTitle>
          <SheetDescription>Create a new client to start tracking their time.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <form.AppForm>
            <form.AppField
              name="name"
              children={(field) => (
                <field.FormItem className="px-4">
                  <field.FormLabel>Client Name</field.FormLabel>
                  <field.FormControl>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter client name"
                      disabled={createMutation.isPending}
                    />
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
                  <Briefcase className="mr-2 h-4 w-4" />
                )}
                Create Client
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
