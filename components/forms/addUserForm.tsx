"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, MailPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { createUser } from "@/app/_actions/user-management";

export function AddUserInTeam({ team }: { team: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const formSchema = z.object({
    emailAddress: z.string().email("This is not a valid email."),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailAddress: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    await createUser(values.emailAddress);

    // then add the user to the team
    const response = await fetch("/api/team/members/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        team: team,
        emailAddress: values.emailAddress,
      }),
    });

    // if the user was added successfully, close the sheet
    if (response.ok) {
      setOpen(false);
      form.reset();
      toast.success("User added successfully");
      router.refresh();
    } else {
      toast.error("Something went wrong");
    }
    setSubmitting(false);
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      form.reset();
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button size="sm">Create</Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex h-full flex-col gap-0 px-0">
        <Form {...form}>
          <SheetHeader className="shrink-0 border-b px-6 pb-4">
            <SheetTitle className="text-xl tracking-normal">Create member</SheetTitle>
            <SheetDescription className="text-xs tracking-normal">
              Add a new member by email to this workspace.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col" autoComplete="off">
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <section className="space-y-4">
                <FormField
                  control={form.control}
                  name="emailAddress"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Email address</FormLabel>
                      <FormControl className="mt-1.5">
                        <Input type="email" placeholder="name@company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>
            </div>
            <SheetFooter className="bg-background shrink-0 border-t px-6 py-4">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit" className="gap-2" disabled={submitting}>
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <MailPlus size={16} />}
                Add member
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
