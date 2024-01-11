"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { SheetWrapper } from "@/components/ui/sheet-wrapper";
import { createGroup } from "app/_actions/create-group-action";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { SheetClose } from "@/components/ui/sheet";

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
          <div className="flex gap-2">
            <Button type="submit">Submit</Button>
            <SheetClose>
              <Button type="button" variant={"outline"} ref={SheetCloseButton}>
                Cancel
              </Button>
            </SheetClose>
          </div>
        </form>
      </Form>
    </SheetWrapper>
  );
}
