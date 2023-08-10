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
import useToast from "@/hooks/useToast";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { allMembers } from "@/types";
import { Input } from "../ui/input";
import { Role } from "@prisma/client";

export function AddUserInTeam({ team }: { team: string }) {
  const router = useRouter();
  const showToast = useToast();
  const SheetCloseButton = useRef<HTMLButtonElement>(null);

  const formSchema = z.object({
    emailAddress: z.string().min(1, { message: "This field has to be filled." }).email("This is not a valid email.")
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch("/api/team/members/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        team: team,
        userrole: Role.USER,
        emailAddress: values.emailAddress
      }),
    });


    if(response?.ok) showToast('User added', 'success');
    else if(response?.status === 500) showToast('User not exist', 'error')
    else showToast('Not added', 'warning');
    
    SheetCloseButton.current?.click();
    router.refresh();
  }

  const handleOpenChange = (evt: boolean) => {
    if (evt) {
      form.reset();
    }
  };

  return (
    <Sheet onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline">Add</Button>
      </SheetTrigger>
      <SheetContent position="right" size="sm">
        <Form {...form}>
          <SheetHeader>
            <SheetTitle>Add a new User</SheetTitle>
          </SheetHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="my-2 grid grid-cols-2 gap-2">
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
