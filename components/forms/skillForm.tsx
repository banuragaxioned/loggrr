"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form";
import { Input } from "components/ui/input";
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
} from "components/ui/sheet";
import { toast } from "sonner";
import { useRef } from "react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().nonempty("Please enter a skill name"),
});

export function NewSkillForm({ team }: { team: string }) {
  const router = useRouter();

  const SheetCloseButton = useRef<HTMLButtonElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch("/api/team/skill", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.name,
        team: team,
      }),
    });

    if (!response?.ok) {
      return toast.error("Something went wrong");
    }

    form.reset();
    SheetCloseButton.current?.click();
    toast.success("A new Skill was created");
    router.refresh();
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Create</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <Form {...form}>
          <SheetHeader>
            <SheetTitle>Add a new skill</SheetTitle>
            <SheetDescription>Make it unique and identifiale for your team.</SheetDescription>
          </SheetHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="my-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Skill name</FormLabel>
                  <FormControl className="my-2">
                    <Input placeholder="Karaoke 🎤" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button type="submit" className="mr-3 mt-2">
                Submit
              </Button>
              <SheetClose asChild>
                <Button type="submit" variant="outline" ref={SheetCloseButton} className="mt-2">
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
