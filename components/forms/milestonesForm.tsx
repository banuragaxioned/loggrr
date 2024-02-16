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
  name: z.string().min(3).max(25, "Milestone name should be between 3 and 25 characters"),
  budget: z.string().min(1, "Please provide a budget"),
  date: z.coerce.date(),
  endDate: z.coerce.date().optional(),
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
        budget: `${edit.obj.budget}`,
        date: new Date(edit.obj.startDate),
        endDate: edit.obj.endDate ? new Date(edit.obj.endDate) : null,
      });
    }
  }, [edit, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (edit.isEditing && JSON.stringify(values) === JSON.stringify(edit.obj)) {
      return;
    }

    const startDateToStoreInDB = format(values.date, "yyyy-MM-dd"); // Extracts only the date
    const endDateToStoreInDB = format(values.endDate || new Date(), "yyyy-MM-dd");

    const data = {
      budget: +values.budget,
      team: team,
      name: values.name,
      startDate: startDateToStoreInDB,
      endDate: endDateToStoreInDB,
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

  const handleOpenChange = (e: boolean) => {
    if (!edit.isEditing) {
      setIsFormOpen(e);
    } else {
      setEdit({ obj: {}, isEditing: e, id: null });
      setIsFormOpen(e);
    }
  };

  return (
    <Sheet onOpenChange={handleOpenChange} open={isFormOpen || edit.isEditing}>
      <SheetTrigger asChild>
        <Button>Add</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <Form {...form}>
          <SheetHeader>
            <SheetTitle>{edit.isEditing ? "Edit" : "Add a new"} Milestone</SheetTitle>
            <SheetDescription>Make it unique and identifiale for your team.</SheetDescription>
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
              name="date"
              render={({ field }) => {
                return (
                  <FormItem className="col-span-2 mt-2">
                    <FormLabel>Date Duration</FormLabel>
                    <FormControl className="mt-2">
                      <CalendarDateRangePicker
                        setVal={form.setValue}
                        setOngoing={setOngoing}
                        isOngoing={isOngoing}
                        {...field}
                        startDate={field.value}
                        endDate={form.getValues().endDate}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => {
                return (
                  <FormItem className="col-span-2 mt-2">
                    <FormLabel>Budget</FormLabel>
                    <FormControl className="mt-2">
                      <Input type="number" placeholder="Budget" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <SheetFooter className="mt-2 gap-x-4">
              <Button type="submit">Submit</Button>
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
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
