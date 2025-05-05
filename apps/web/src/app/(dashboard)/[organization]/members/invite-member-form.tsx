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
import { useAppForm, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

interface InviteMemberFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

type Role = "member" | "admin" | "owner";

export function InviteMemberForm({ open, onOpenChange, onSuccess }: InviteMemberFormProps) {
  const createMutation = useMutation({
    mutationFn: async (data: { email: string; role: Role }) => {
      await authClient.organization.inviteMember({
        email: data.email,
        role: data.role,
      });
    },
    onSuccess: () => {
      onSuccess();
      onOpenChange(false);
      toast.success("Invitation sent successfully");
    },
    onError: () => {
      toast.error("Failed to send invitation");
    },
  });

  const form = useAppForm({
    defaultValues: {
      email: "",
      role: "member" as Role,
    },
    onSubmit: async ({ value }) => {
      try {
        await createMutation.mutateAsync({
          email: value.email,
          role: value.role,
        });
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
            <SheetTitle>Invite New Member</SheetTitle>
            <SheetDescription>Invite a new member to your organization.</SheetDescription>
          </SheetHeader>
          <div className="p-4 space-y-4">
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => {
                  if (!value.trim()) return "Email is required";
                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
                  return undefined;
                },
              }}
            >
              {(field) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter member's email"
                      disabled={createMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            </form.Field>
            <form.Field
              name="role"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return "Role is required";
                  return undefined;
                },
              }}
            >
              {(field) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select
                      value={field.state.value}
                      onValueChange={(value: Role) => field.handleChange(value)}
                      disabled={createMutation.isPending}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            </form.Field>
          </div>

          <SheetFooter>
            <Button type="submit" className="w-full" disabled={createMutation.isPending}>
              {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Invitation"}
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
