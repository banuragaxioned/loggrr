"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ComboBox } from "@/components/ui/combobox";
import { Loader2, Plus, User } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type Member = {
  id: number;
  name: string | null;
  email: string;
  image: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED" | "DEACTIVATED";
  role: "OWNER" | "MANAGER" | "USER" | "GUEST" | "INACTIVE" | "HR";
  userGroup: { name: string; id: number }[];
};

const validateHalfDayIncrement = (value: number) => {
  // Check if the number is in 0.5 increments
  return value % 0.5 === 0;
};

const numberSchema = z.union([
  z.string().refine((val) => val === "", "Value is required"),
  z.coerce
    .number()
    .min(0, "Value must be 0 or greater")
    .refine(validateHalfDayIncrement, "Value must be in increments of 0.5 days"),
]);

const leaveFormSchema = z.object({
  userId: z.number().int().min(1, "Please select a member"),
  planned: z.object({
    eligible: numberSchema,
    taken: numberSchema,
  }),
  unplanned: z.object({
    eligible: numberSchema,
    taken: numberSchema,
  }),
  compoff: z.object({
    eligible: numberSchema,
    taken: numberSchema,
  }),
});

type LeaveFormValues = z.infer<typeof leaveFormSchema>;

interface LeaveFormProps {
  team: string;
  users: Member[];
  leaves: {
    id: number;
    leaves: any;
    user: {
      id: number;
      name: string | null;
    };
  }[];
}

export function LeaveForm({ team, users, leaves }: LeaveFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit_id");

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    const fetchLeaveRecord = () => {
      if (editId) {
        setLoading(true);
        try {
          const editData = leaves.find((leave) => leave.id === Number(editId));

          if (!editData) return;

          setSelectedMember(editData.user as Member);
          form.setValue("userId", editData.user.id);
          form.setValue("planned", {
            eligible: editData.leaves.planned.eligible,
            taken: editData.leaves.planned.taken,
          });
          form.setValue("unplanned", {
            eligible: editData.leaves.unplanned.eligible,
            taken: editData.leaves.unplanned.taken,
          });
          form.setValue("compoff", {
            eligible: editData.leaves.compoff.eligible,
            taken: editData.leaves.compoff.taken,
          });
          setOpen(true);
        } catch (error) {
          toast.error("Failed to fetch leave record");
        } finally {
          setLoading(false);
        }
      }
    };

    if (editId) {
      fetchLeaveRecord();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId, team]);

  // Filter out users who already have leave records
  const usersWithoutLeaves = users.filter((user) => !leaves.some((leave) => leave.user.id === user.id));

  // Format users data for ComboBox
  const formattedUsers = usersWithoutLeaves.map((user) => ({
    id: user.id,
    name: user.name || user.email,
  }));

  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      userId: 0,
      planned: { eligible: "", taken: "" },
      unplanned: { eligible: "", taken: "" },
      compoff: { eligible: "", taken: "" },
    },
  });

  const handleMemberSelect = (selected: string) => {
    const memberValue = users.find((user) => user.id === +selected);
    setSelectedMember(memberValue || null);
    form.setValue("userId", memberValue?.id ?? 0);
  };

  async function onSubmit(data: LeaveFormValues) {
    setLoading(true);

    try {
      const url = editId ? `/api/team/leaves` : `/api/team/leaves/create`;
      const method = editId ? "PUT" : "POST";
      const successMessage = editId ? "updated" : "created";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          team,
          id: editId ? parseInt(editId) : undefined,
          userId: data.userId,
          leaves: {
            planned: data.planned,
            unplanned: data.unplanned,
            compoff: data.compoff,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${editId ? "update" : "create"} leave record`);
      }

      if (response.ok) {
        toast.success(`${editId ? "Updated" : "Created"} leave record successfully!`);
        resetForm();
        setOpen(false);
        // Preserve all query params except edit_id
        const params = new URLSearchParams(searchParams.toString());
        params.delete("edit_id");
        router.replace(params.toString() ? `?${params.toString()}` : "?");
        router.refresh();
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${editId ? "update" : "create"} leave record. Please try again.`,
      );
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    form.reset();
    setSelectedMember(null);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
          // Preserve all query params except edit_id
          const params = new URLSearchParams(searchParams.toString());
          params.delete("edit_id");
          router.replace(params.toString() ? `?${params.toString()}` : "?");
        }
        setOpen(open);
      }}
    >
      <SheetTrigger asChild>
        <Button className="flex gap-2" size="sm">
          <Plus className="h-4 w-4" />
          Add Leave Record
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="h-full overflow-y-auto">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        )}
        <Form {...form}>
          <SheetHeader>
            <SheetTitle>{editId ? "Edit" : "Create"} Leave Record</SheetTitle>
            <SheetDescription>{editId ? "Edit" : "Add"} leave record for a team member.</SheetDescription>
          </SheetHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="my-2 flex flex-col gap-y-1" autoComplete="off">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem className="w-full-combo">
                  <FormLabel>Member</FormLabel>
                  <FormControl>
                    <ComboBox
                      searchable
                      icon={<User size={16} />}
                      options={formattedUsers}
                      label="Member"
                      selectedItem={
                        selectedMember
                          ? { id: selectedMember.id, name: selectedMember.name || selectedMember.email }
                          : null
                      }
                      handleSelect={(selected) => handleMemberSelect(selected)}
                      {...field}
                      className="w-full max-w-full"
                      disabled={!!editId}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {Object.entries({
              planned: "Planned Leave",
              unplanned: "Unplanned Leave",
              compoff: "Comp Off",
            }).map(([key, label]) => (
              <div key={key} className="mt-4">
                <h3 className="text-base font-medium">{label}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`${key}.eligible` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Eligible</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.5"
                            {...field}
                            placeholder="Days"
                            className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`${key}.taken` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Taken</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.5"
                            {...field}
                            placeholder="Days"
                            className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
            <SheetFooter className="mt-4">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Submit"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
