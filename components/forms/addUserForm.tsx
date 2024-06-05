"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { createUser } from "@/app/_actions/user-management";

export function AddUserInTeam({ team }: { team: string }) {
  const router = useRouter();

  const SheetCloseButton = useRef<HTMLButtonElement>(null);

  const formSchema = z.object({
    emailAddress: z.string().email("This is not a valid email."),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // try creating a user first
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
      SheetCloseButton.current?.click();
      form.reset();
      toast.success("User added successfully");
      router.refresh();
    } else {
      toast.error("Something went wrong");
    }
  }

  const handleOpenChange = (evt: boolean) => {
    if (evt) {
      form.reset();
    }
  };

  return (
    <Sheet onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button size="sm">Create</Button>
      </SheetTrigger>
      <SheetContent side="right" className="h-full overflow-y-auto">
        <Form {...form}>
          <SheetHeader>
            <SheetTitle>Create a new User</SheetTitle>
          </SheetHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="my-2 flex flex-col gap-3" autoComplete="off">
            <FormField
              control={form.control}
              name="emailAddress"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Email address</FormLabel>
                  <FormControl className="mt-2">
                    <Input type="string" placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="mt-2 justify-start space-x-3">
              <SheetClose asChild>
                <Button type="button" variant="outline" ref={SheetCloseButton}>
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
