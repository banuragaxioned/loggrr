"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form";
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
import { InlineCombobox } from "../ui/combobox";
import { Laptop, User } from "lucide-react";
import { AllUsersWithAllocation } from "types";
import { SingleSelectDropdown } from "../ui/single-select-dropdown";
import { levels } from "config/skills";

type Scores = {
  id: number;
  name: string;
  value: number;
  skillId: number;
}[];

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
  userSkills,
}: {
  team: string;
  users: AllUsersWithAllocation[];
  currentUser: number;
  skillsList: { id: number; name: string }[];
  userSkills: Scores;
}) {
  const router = useRouter();

  const SheetCloseButton = useRef<HTMLButtonElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const isSkillExist = userSkills.find((skills) => skills.skillId === values.skillId);

    SheetCloseButton.current?.click();

    if (!isSkillExist) {
      const response = await fetch("/api/team/skill/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          team: team,
          userId: values.userId,
          skillId: values.skillId,
          skillScore: values.skillScore,
        }),
      });

      if (!response?.ok) {
        return toast.error("Something went wrong");
      }
      toast.success("A new skill added");
      router.refresh();
    } else {
      toast.info("This skill already exists");
    }
  }

  return (
    <Sheet onOpenChange={(evt: boolean) => evt && form.reset()}>
      <SheetTrigger asChild>
        <Button>Add</Button>
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
                      icon={<User className="mr-2 h-4 w-4 shrink-0 opacity-50" />}
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
                      icon={<Laptop className="mr-2 h-4 w-4 shrink-0 opacity-50" />}
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
                    <SingleSelectDropdown
                      options={levels}
                      defaultValue={levels[0]}
                      setOptions={(value: string) => form.setValue("skillScore", Number(value))}
                      triggerClassName="mt-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="mt-5 flex gap-2">
              <Button type="submit" variant="default">
                Submit
              </Button>
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
