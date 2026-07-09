"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Building2, Loader2 } from "lucide-react";

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

const formSchema = z.object({
  name: z.string().min(2),
});

export function NewClientForm({ team }: { team: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    const response = await fetch("/api/team/client", {
      method: "POST",
      body: JSON.stringify({
        name: values.name,
        team: team,
      }),
    });

    if (!response?.ok) {
      setSubmitting(false);
      return toast.error("Unable to create client. Please try again later.");
    }

    toast.success(`${values.name} created successfully!`);
    form.reset();
    setOpen(false);
    router.refresh();
    setSubmitting(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="flex gap-2" size="sm">
          Create
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex h-full flex-col gap-0 px-0">
        <Form {...form}>
          <SheetHeader className="shrink-0 border-b px-6 pb-4">
            <SheetTitle className="text-xl tracking-normal">Create client</SheetTitle>
            <SheetDescription className="text-xs tracking-normal">
              Add a client profile your team can assign to projects.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col" autoComplete="off">
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <section className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold tracking-normal">Client Details</h3>
                  <p className="text-muted-foreground text-xs tracking-normal">
                    This name appears across project and report screens.
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client name</FormLabel>
                      <FormControl className="mt-1.5">
                        <Input placeholder="e.g. Acme Inc." {...field} />
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
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Building2 size={16} />}
                Create client
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
