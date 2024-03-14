"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function ProfileForm({ user }: { user: any }) {
  const [name, setName] = useState(user.name);

  async function onSubmit() {
    try {
      const response = await fetch("/api/manage/profile", {
        method: "PUT",
        body: JSON.stringify({
          id: user.id,
          name: name,
        }),
      });

      if (!response?.ok) {
        return toast.error("Something went wrong!");
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile", error);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="mb-2 space-y-8"
      autoComplete="off"
    >
      <div className="space-y-2">
        <Label>Name</Label>
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <p className="text-sm text-muted-foreground">This is your public display name.</p>
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input placeholder="Email" disabled defaultValue={user.email} />
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
  );
}
