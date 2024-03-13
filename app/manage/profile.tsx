"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const profileFormSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  // timezone: z.string(),
  // language: z.string(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm({ user }: { user: any }) {
  const router = useRouter();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
  });

  async function onSubmit(data: ProfileFormValues) {
    try {
      const response = await fetch("/api/manage/profile", {
        method: "PUT",
        body: JSON.stringify({
          id: user.id,
          name: data.name,
        }),
      });

      if (!response?.ok) {
        return toast.error("Something went wrong!");
      }

      toast.success("Profile updated successfully!");
      // window.location.reload();
    } catch (error) {
      console.error("Error updating profile", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" autoComplete="off">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} defaultValue={user.name} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <Label>Email</Label>
          <Input placeholder="email" disabled defaultValue={user.email} />
          <p className="text-sm text-muted-foreground">You are currently using this email.</p>
        </div>
        {/* <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Zone</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones?.map((timezone: string) => (
                      <SelectItem key={timezone} value={timezone}>
                        {timezone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </FormControl>
              </Select>
              <FormDescription>You can manage time zones based on your location or interest.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Locale</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a locale" defaultValue="English" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones?.map((timezone: string) => (
                      <SelectItem key={timezone} value={timezone}>
                        {timezone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </FormControl>
              </Select>
              <FormDescription>You can manage time zones based on your location or interest.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  );
}
