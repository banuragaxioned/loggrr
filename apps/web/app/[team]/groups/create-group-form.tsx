"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { SheetWrapper } from "@/components/ui/sheet-wrapper";
import { createGroup } from "@/app/_actions/create-group-action";

const FormSchema = z.object({
  groupName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export function CreateGroupForm({ team }: { team: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      groupName: "",
    },
  });

  const SheetCloseButton = useRef<HTMLButtonElement>(null);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const result = await createGroup(team, data.groupName);
    if (result.success) {
      toast.success("A new Client was created");
      formRef.current?.reset();
      router.refresh();
      form.reset();
      SheetCloseButton.current?.click();
    } else {
      toast.error("Something went wrong");
    }
  }

  return (
    <SheetWrapper button="Create" title="Create a new group" description="Create a new group to add members to.">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3" autoComplete="off">
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
    </SheetWrapper>
  );
}
