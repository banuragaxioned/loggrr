"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FolderPlus, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { createGroup } from "@/app/_actions/create-group-action";

const FormSchema = z.object({
  groupName: z.string().min(2, {
    message: "Group name must be at least 2 characters.",
  }),
});

export function CreateGroupForm({ team }: { team: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      groupName: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setSubmitting(true);
    const result = await createGroup(team, data.groupName);
    if (result.success) {
      toast.success("Group created");
      router.refresh();
      form.reset();
      setOpen(false);
    } else {
      toast.error("Something went wrong");
    }
    setSubmitting(false);
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
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
            <SheetTitle className="text-xl tracking-normal">Create group</SheetTitle>
            <SheetDescription className="text-xs tracking-normal">
              Organize workspace members using groups.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col" autoComplete="off">
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <section className="space-y-4">
                <div>
                  <p className="text-muted-foreground text-xs tracking-normal">
                    Choose a clear name so members can find and manage groups quickly.
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="groupName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group name</FormLabel>
                      <FormControl className="mt-1.5">
                        <Input placeholder="e.g. Engineering, Marketing, etc." {...field} />
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
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <FolderPlus size={16} />}
                Create group
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
