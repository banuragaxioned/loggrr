"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  projectName: z
    .string()
    .min(6, {
      message: "Username must be at least 6 characters.",
    })
    .max(12, {
      message: "Username must be less than 12 characters.",
    }),
  milestoneName: z
    .string()
    .min(6, {
      message: "Username must be at least 6 characters.",
    })
    .max(12, {
      message: "Username must be less than 12 characters.",
    }),
  taskName: z
    .string()
    .min(6, {
      message: "Username must be at least 6 characters.",
    })
    .max(12, {
      message: "Username must be less than 12 characters.",
    }),
  time: z.number().min(1, {
    message: "Hour should be greater than 1",
  }),
});

export function TimeLogForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      milestoneName: "",
      taskName: "",
      time: 0,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-4 gap-4">
        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Project Name</FormLabel>
              <FormControl className="mt-2">
                <Input placeholder="Project" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="milestoneName"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Milestone Name</FormLabel>
              <FormControl className="mt-2">
                <Input placeholder="Milestone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="taskName"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Task Name</FormLabel>
              <FormControl className="mt-2">
                <Input placeholder="Task" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Hours</FormLabel>
              <FormControl className="mt-2">
                <Input type="number" placeholder="Hours" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="secondary" className="mt-4">
          Submit
        </Button>
      </form>
    </Form>
  );
}
