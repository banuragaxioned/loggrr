"use client";

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
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDateRangePicker } from "@/components/date-picker";

const formSchema = z.object({
  milestone: z.string().min(3).max(25, "Milestone name should be between 3 and 25 characters"),
  budget: z.string().regex(new RegExp(/^[1-9][0-9]*$/), "Please provide a budget"),
  date: z.coerce.date(),
  enddate: z.coerce.date().optional(),
});

interface NewProjectFormProps {
  team: string;
  project: number;
}

export function NewMilestoneForm({ team, project }: NewProjectFormProps) {
  const router = useRouter();

  const SheetCloseButton = useRef<HTMLButtonElement>(null);
  const [isOngoing, setOngoing] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/team/project/milestones", {
        method: "POST",
        body: JSON.stringify({
          budget: Number(values.budget),
          team: team,
          name: values.milestone,
          startDate: new Date(values.date),
          endDate: values.enddate ? new Date(values.enddate) : null,
          projectId: +project
        }),
      });

      if (!response?.ok) {
        return toast.error("Failed to create a new Milestone");
      }

      form.reset();
      SheetCloseButton.current?.click();
      toast.success("A new Milestone was created");
      router.refresh();
    } catch (error) {
      console.error("Error creating a new Milestone:", error);
    }
  }

  const handleOpenChange = (e: boolean) => e && form.reset();

  return (
    <Sheet onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button>Add</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <Form {...form}>
          <SheetHeader>
            <SheetTitle>Add a new Milestone</SheetTitle>
            <SheetDescription>Make it unique and identifiale for your team.</SheetDescription>
          </SheetHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="my-2 flex flex-col gap-y-1">
            <FormField
              control={form.control}
              name="milestone"
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
              render={({ field }) => (
                <FormItem className="col-span-2 mt-2">
                  <FormLabel>Date Duration</FormLabel>
                  <FormControl className="mt-2">
                    <CalendarDateRangePicker setVal={form.setValue} setOngoing={setOngoing} isOngoing={isOngoing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem className="col-span-2 mt-2">
                  <FormLabel>Budget</FormLabel>
                  <FormControl className="mt-2">
                    <Input placeholder="Budget" {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="gap-x-4 mt-2">
              <Button type="submit">Submit</Button>
              <SheetClose asChild>
                <Button type="submit" variant="outline" ref={SheetCloseButton}>
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
