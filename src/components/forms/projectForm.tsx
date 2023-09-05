"use client";

// TODO: This is incomplete

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
import useToast from "@/hooks/useToast";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { ProjectInterval } from "@prisma/client";

const formSchema = z.object({
  clientId: z.number().int("Please select a client"),
  name: z.string().nonempty("Please provide a Project name"),
  team: z.string().nonempty("Please enter a team"),
});

export function NewProjectForm({ team }: { team: string }) {
  const router = useRouter();
  const showToast = useToast();
  const SheetCloseButton = useRef<HTMLButtonElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch("/api/team/project/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.name,
        team: team,
        clientId: 2,
        ownerId: 1,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        interval: ProjectInterval.WEEKLY,
      }),
    });

    if (!response?.ok) {
      return showToast("Something went wrong.", "warning");
    }

    form.reset();
    SheetCloseButton.current?.click();
    showToast("A new Client was created", "success");
    router.refresh();
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Add</Button>
      </SheetTrigger>
      <SheetContent position="right" size="sm">
        <Form {...form}>
          <SheetHeader>
            <SheetTitle>Add a new Project</SheetTitle>
            <SheetDescription>Make it unique and identifiale for your team.</SheetDescription>
          </SheetHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="my-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Project name</FormLabel>
                  <FormControl className="my-2">
                    <Input placeholder="Acme Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button type="submit" variant="secondary">
                Submit
              </Button>
              <SheetClose asChild>
                <Button type="submit" ref={SheetCloseButton}>
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
