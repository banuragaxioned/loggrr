"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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

const formSchema = z.object({
  name: z.string().min(3).max(25, "Task name should be between 3 and 25 characters"),
  budget: z.union([z.string().min(1, "Please provide a budget"), z.number()]),
});

interface TaskFormProps {
  team: string;
  project: number;
  edit: { obj: any; isEditing: boolean; id: number | null };
  setEdit: Function;
  isFormOpen: boolean;
  setIsFormOpen: Function;
}

export function ProjectTaskForm({ team, project, edit, setEdit, isFormOpen, setIsFormOpen }: TaskFormProps) {
  const router = useRouter();

  const SheetCloseButton = useRef<HTMLButtonElement>(null);
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
      budget: +values.budget,
      team: team,
      name: values.name,
      projectId: +project,
    };

    try {
      const response = await fetch("/api/team/project/task", {
        method: edit.isEditing ? "PUT" : "POST",
        body: JSON.stringify(edit.isEditing ? { ...data, id: edit.id } : data),
      });

      if (response?.ok) {
        toast.success(`Task ${edit.isEditing ? "updated" : "added"} successfully in the project`);
        setIsFormOpen(false);
        if (edit.isEditing) {
          setEdit({ obj: {}, isEditing: false, id: null });
        }

        form.reset();
        SheetCloseButton.current?.click();
        router.refresh();
      } else {
        toast.error(`Failed to ${edit.isEditing ? "update" : "add"} the task.`);
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error creating a new Task", error);
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
      <SheetContent side="right">
        <Form {...form}>
          <SheetHeader>
            <SheetTitle>{edit.isEditing ? "Edit" : "Create a new"} Task</SheetTitle>
            <SheetDescription>Make it unique and identifiable for your team.</SheetDescription>
          </SheetHeader>
          <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)} className="my-2 flex flex-col gap-y-1">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-2 mt-2">
                  <FormLabel>Task name</FormLabel>
                  <FormControl className="mt-2">
                    <Input placeholder="Task Name" {...field} />
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
