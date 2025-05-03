"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface CreateSkillFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateSkillForm({ open, onOpenChange, onSuccess }: CreateSkillFormProps) {
  const createMutation = useMutation(trpc.skill.create.mutationOptions());

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const activeMember = await authClient.organization.getActiveMember();
        if (!activeMember?.data?.id) {
          toast.error("You must be authenticated to create a skill");
          return;
        }

        await createMutation.mutateAsync({
          name: value.name,
          description: value.description || undefined,
          memberId: activeMember.data.id,
        });

        toast.success("Skill created successfully");
        onSuccess();
        form.reset();
      } catch (error) {
        toast.error("Failed to create skill");
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
            <SheetTitle>Create Skill</SheetTitle>
            <SheetDescription>Add a new skill to your organization.</SheetDescription>
          </SheetHeader>
          <div className="p-4 space-y-4">
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return "Name is required";
                  return undefined;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <label htmlFor="name">Name</label>
                  <Input
                    id="name"
                    value={field.state.value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.handleChange(e.target.value)}
                    placeholder="Enter skill name"
                    disabled={createMutation.isPending}
                  />
                  {field.state.meta.errors ? (
                    <p className="text-sm text-destructive">{field.state.meta.errors}</p>
                  ) : null}
                </div>
              )}
            </form.Field>

            <form.Field
              name="description"
              validators={{
                onChange: ({ value }) => {
                  return undefined;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <label htmlFor="description">Description</label>
                  <Textarea
                    id="description"
                    value={field.state.value}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => field.handleChange(e.target.value)}
                    placeholder="Enter skill description"
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
