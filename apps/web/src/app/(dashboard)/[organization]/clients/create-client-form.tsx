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
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";

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

  const form = useForm({
    defaultValues: {
      name: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await createMutation.mutateAsync({ name: value.name });
        form.reset();
      } catch (error) {
        // Error is handled by mutation
      }
    },
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-4"
        >
          <SheetHeader>
            <SheetTitle>Create New Client</SheetTitle>
            <SheetDescription>Create a new client to start tracking their time.</SheetDescription>
          </SheetHeader>
          <div className="p-4 space-y-4">
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) => {
                  if (!value.trim()) return "Name is required";
                  return undefined;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <label htmlFor="client-name">Client Name</label>
                  <Input
                    id="client-name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter client name"
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
            <Button type="submit" className="w-full" disabled={createMutation.isPending}>
              {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Client"}
            </Button>
            <SheetClose asChild>
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
