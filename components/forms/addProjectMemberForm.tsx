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
import { ComboBox } from "../ui/combobox";
import { User } from "lucide-react";
import { AllUsersWithAllocation } from "@/types";

export function AddMemberInProject({
  team,
  project,
  users,
}: {
  team: string;
  project: number;
  users: {
    id: number;
    name: string;
    email: string;
    image: string;
  }[]
}) {
  const router = useRouter();

  const SheetCloseButton = useRef<HTMLButtonElement>(null);

  const formSchema = z.object({
    userId: z.number().min(1, "Please select a user"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch("/api/team/project/members", {
      method: "POST",
      body: JSON.stringify({
        team: team,
        projectId: +project,
        user: values.userId,
      }),
    });

    if (response?.ok) toast.success("User added");
    else if (response?.status === 500) toast.warning("The user doesn't have an account");
    else toast.error("Something went wrong");

    SheetCloseButton.current?.click();
    router.refresh();
  }

  const handleOpenChange = (evt: boolean) => {
    if (evt) {
      form.reset();
    }
  };

  const dropdownSelectHandler = (selected: string, setValue: Function) => {
    const arr = users.find((user) => user.id === +selected);
    setValue(arr?.id)
  };

  return (
    <Sheet onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button>Add</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <Form {...form}>
          <SheetHeader>
            <SheetTitle>Add a new User</SheetTitle>
          </SheetHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="my-2 grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>User</FormLabel>
                  <FormControl className="mt-2">
                    <ComboBox
                      tabIndex={1}
                      searchable
                      icon={<User size={16} />}
                      options={users}
                      label="Members"
                      selectedItem={field.value}
                      handleSelect={(selected: any) => dropdownSelectHandler(selected, form.setValue)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="mt-2 justify-start space-x-3">
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
