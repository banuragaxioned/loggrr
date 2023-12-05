"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useToast from "@/hooks/useToast";
import { SheetWrapper } from "@/components/sheet-wrapper";
import { createGroup } from "@/app/_actions/create-group-action";
import { useRouter } from "next/navigation";
import { useRef } from "react";

const FormSchema = z.object({
  groupName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export function CreateGroupForm({ team }: { team: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const showToast = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      groupName: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    createGroup(team, data.groupName).then(() => {
      showToast("A new Client was created", "success");
      formRef.current?.reset();
      router.refresh();
    });
  }

  return (
    <SheetWrapper button="Create" title="Create a new group" description="Create a new group to add members to.">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
          <FormField
            control={form.control}
            name="groupName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group name</FormLabel>
                <FormControl>
                  <Input placeholder="Astronauts" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </SheetWrapper>
  );
}
