"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CalendarDateRangePicker } from "@/components/date-picker";
import { format } from "date-fns";

const formSchema = z.object({
  name: z.string().min(3).max(50, "Milestone name should be between 3 and 50 characters"),
  budget: z.union([z.string(), z.number()]).optional(),
});

interface NewProjectFormProps {
  team: string;
  project: number;
  edit: { obj: any; isEditing: boolean; id: number | null };
  setEdit: Function;
  isFormOpen: boolean;
  setIsFormOpen: Function;
}

export function NewMilestoneForm({ team, project, edit, setEdit, isFormOpen, setIsFormOpen }: NewProjectFormProps) {
  const router = useRouter();

  const SheetCloseButton = useRef<HTMLButtonElement>(null);
  const [isOngoing, setOngoing] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (edit.isEditing) {
      form.reset({
        ...edit.obj,
        budget: edit.obj.budget,
      });
    }
  }, [edit, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (edit.isEditing && values === edit.obj) {
      return;
    }

    const data = {
      budget: values.budget ? +values.budget : 0,
      team: team,
      name: values.name,
      projectId: +project,
    };

    try {
      const response = await fetch("/api/team/project/milestones", {
        method: `${edit.isEditing ? "PUT" : "POST"}`,
        body: JSON.stringify(edit.isEditing ? { ...data, id: edit.id } : data),
      });

      if (response?.ok) {
        toast.success(`${edit.isEditing ? "Updated" : "Added"} Milestone in the project`);
        setIsFormOpen(false);
        if (edit.isEditing) {
          setEdit({ obj: {}, isEditing: false, id: null });
        }

        form.reset();
        SheetCloseButton.current?.click();
        router.refresh();
      } else {
        toast.error(`Failed to ${edit.isEditing ? "update" : "add"} the milestone`);
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error creating a new Milestone:", error);
    }
  }

  const handleOpenChange = (event: boolean) => {
    if (edit.isEditing) {
      setEdit({ obj: {}, isEditing: event, id: null });
    }
    if (!event) {
      form.reset({ name: "", budget: "" });
    }
    setIsFormOpen(event);
  };

  return (
    <Sheet onOpenChange={handleOpenChange} open={isFormOpen || edit.isEditing}>
      <SheetTrigger asChild>
        <Button className="absolute right-0">Create</Button>
      </SheetTrigger>
      <SheetContent side="right" className="h-full overflow-y-auto">
        <Form {...form}>
          <SheetHeader>
            <SheetTitle>{edit.isEditing ? "Edit" : "Create a new"} Milestone</SheetTitle>
            <SheetDescription>Make it unique and identifiable for your team.</SheetDescription>
          </SheetHeader>
          <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)} className="my-2 flex flex-col gap-y-1">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-2 mt-2">
                  <FormLabel>Milestone name</FormLabel>
                  <FormControl className="mt-2">
                    <Input placeholder="Milestone Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => {
                return (
                  <FormItem className="col-span-2 mt-2">
                    <FormLabel>Budget</FormLabel>
                    <FormControl className="mt-2">
                      <Input placeholder="Budget" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <SheetFooter className="mt-2">
              <SheetClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEdit({ obj: {}, isEditing: false, id: null });
                    setIsFormOpen(false);
                  }}
                  ref={SheetCloseButton}
                >
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit">Submit</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
