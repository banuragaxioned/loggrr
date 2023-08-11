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
import useToast from "@/hooks/useToast";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { InlineCombobox } from "../ui/combobox";
import { Icons } from "../icons";
import { AllUsersWithAllocation } from "@/types";
import { SelectSkillLevel } from "../selectSkill";

const formSchema = z.object({
  skillId: z.coerce.number(),
  userId: z.coerce.number().optional(),
  skillScore: z.coerce.number(),
});

export function AddSKill({
  team,
  users,
  currentUser,
  skillsList,
}: {
  team: string;
  users: AllUsersWithAllocation[];
  currentUser: number;
  skillsList: { id: number; name: string }[];
}) {
  const router = useRouter();
  const showToast = useToast();
  const SheetCloseButton = useRef<HTMLButtonElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // const response = await fetch("/api/team/skill", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     name: values.name,
    //     team: team,
    //   }),
    // });

    // if (!response?.ok) {
    //   return showToast("Something went wrong.", "warning");
    // }

    // form.reset();
    // SheetCloseButton.current?.click();
    // showToast("A new Client was created", "success");
    // router.refresh();
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Add</Button>
      </SheetTrigger>
      <SheetContent position="right" size="sm">
        <Form {...form}>
          <SheetHeader>
            <SheetTitle>Add a new skill</SheetTitle>
            <SheetDescription>Make it unique and identifiale for your team.</SheetDescription>
          </SheetHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="my-2">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>User</FormLabel>
                  <FormControl className="my-2">
                    <InlineCombobox
                      label="users"
                      options={users}
                      setVal={form.setValue}
                      fieldName="userId"
                      icon={<Icons.user className="mr-2 h-4 w-4 shrink-0 opacity-50" />}
                      defaultValue={currentUser}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="skillId"
              render={({ field }) => (
                <FormItem className="col-span-2 pt-1">
                  <FormLabel>Skill</FormLabel>
                  <FormControl className="my-2">
                    <InlineCombobox
                      label="skill"
                      options={skillsList}
                      setVal={form.setValue}
                      fieldName="skillId"
                      icon={<Icons.laptop className="mr-2 h-4 w-4 shrink-0 opacity-50" />}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="skillScore"
              render={({ field }) => (
                <FormItem className="col-span-2 pt-1">
                  <FormLabel>Skill Score</FormLabel>
                  <FormControl className="my-2">
                    <SelectSkillLevel
                      skill={{ id: 0, name: "N/A", level: 0 }}
                      setValue={(skill: number, value: string) => form.setValue("skillScore", Number(value))}
                      className={"mt-2"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="mt-5 flex gap-2">
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
