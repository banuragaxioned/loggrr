"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { MailIcon } from "lucide-react";
import { toast } from "sonner";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export function MagicLinkForm() {
  const form = useForm({
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => {
            const result = emailSchema.safeParse({ email: value });
            return result.success ? undefined : result.error.issues[0].message;
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="w-full"
            />
            {field.state.meta.errors ? <p className="text-sm text-destructive">{field.state.meta.errors}</p> : null}
          </div>
        )}
      </form.Field>

      <Button type="submit" variant="outline" className="w-full" disabled={form.state.isSubmitting}>
        <MailIcon className="mr-2 h-4 w-4" />
        {form.state.isSubmitting ? "Sending..." : "Send Magic Link"}
      </Button>
    </form>
  );
}
