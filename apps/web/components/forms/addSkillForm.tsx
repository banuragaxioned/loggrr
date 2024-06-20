"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Laptop, User } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
import { AllUsersWithAllocation } from "@/types";
import { levels } from "@/config/skills";
import { ComboBox } from "../ui/combobox";
import { SingleSelectDropdown } from "../ui/single-select-dropdown";

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
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);

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
        body: JSON.stringify({
          team,
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

  const handelUsers = (selected: string) => {
    const user = users.find((obj) => obj.id === Number(selected));
    setSelectedUser(user);
    form.setValue("userId", user?.id ?? 0);
  };

  const handleSkills = (selected: string) => {
    const skills = skillsList.find((obj) => obj.id === Number(selected));
    setSelectedSkill(skills);
    form.setValue("skillId", skills?.id ?? 0);
  };

  const handleOpenChange = (evt: boolean) => {
    if (evt) {
      setSelectedUser(null);
      setSelectedSkill(null);
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
            <SheetTitle>Create a new skill</SheetTitle>
            <SheetDescription>Make it unique and identifiale for your team.</SheetDescription>
          </SheetHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="my-2">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem className="w-full-combo col-span-2">
                  <FormLabel>User</FormLabel>
                  <FormControl className="my-2">
                    <ComboBox
                      searchable
                      icon={<User size={16} />}
                      options={[users.find((user) => user.id === currentUser)]}
                      label="User"
                      selectedItem={selectedUser}
                      handleSelect={(selected) => handelUsers(selected)}
                      {...field}
                      className="-mt-1 w-full max-w-full"
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
                <FormItem className="w-full-combo col-span-2 pt-3">
                  <FormLabel>Skill</FormLabel>
                  <FormControl className="my-2">
                    <ComboBox
                      searchable
                      icon={<Laptop size={16} />}
                      options={skillsList}
                      label="Skills"
                      selectedItem={selectedSkill}
                      handleSelect={(selected) => handleSkills(selected)}
                      {...field}
                      className="-mt-1 w-full max-w-full"
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
                <FormItem className="col-span-2 pt-3">
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
            <SheetFooter className="mt-5 flex">
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
