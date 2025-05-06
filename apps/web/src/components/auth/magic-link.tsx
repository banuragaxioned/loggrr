"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { useAppForm } from "@/components/ui/form";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { MailIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export function MagicLinkForm() {
  const form = useAppForm({
    validators: { onChange: formSchema },
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await signIn.magicLink({
          email: value.email,
          callbackURL: process.env.NEXT_PUBLIC_URL + "/dashboard",
        });
      } catch (error) {
        toast.error("Failed to send magic link. Please try again.");
      }
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form],
  );

  return (
    <form.AppForm>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <form.AppField
          name="email"
          children={(field) => (
            <field.FormItem>
              <field.FormControl>
                <Input
                  placeholder="Enter your email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </field.FormControl>
              <field.FormMessage />
            </field.FormItem>
          )}
        />

        <Button type="submit" variant="outline" className="w-full" disabled={form.state.isSubmitting}>
          {form.state.isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <MailIcon className="mr-2 h-4 w-4" />
          )}
          Send Magic Link
        </Button>
      </form>
    </form.AppForm>
  );
}
