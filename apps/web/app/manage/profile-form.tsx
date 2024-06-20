"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useTimezoneSelect, allTimezones as timezones } from "react-timezone-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function ProfileForm({ user }: { user: any }) {
  const { options } = useTimezoneSelect({ labelStyle: "original", timezones });
  const [name, setName] = useState(user.name);
  const [timezone, setTimezone] = useState(user.timezone === "Etc/UTC" ? "Etc/GMT" : user.timezone);

  async function onSubmit() {
    try {
      const response = await fetch("/api/manage/profile", {
        method: "PUT",
        body: JSON.stringify({
          id: user.id,
          name,
          timezone,
        }),
      });

      if (!response?.ok) {
        return toast.error("Something went wrong!");
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Error updating profile");
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
        <Input placeholder="Name" value={name ?? ""} onChange={(e) => setName(e.target.value)} />
        <p className="text-sm text-muted-foreground">This is your public display name.</p>
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input placeholder="Email" disabled defaultValue={user.email} />
        <p className="text-sm text-muted-foreground">You are currently using this email.</p>
      </div>
      <div className="space-y-2">
        <Label>Time Zone</Label>
        <Select onValueChange={(value) => setTimezone(value)} value={timezone ?? "Etc/UTC"}>
          <SelectTrigger>
            <SelectValue placeholder="Select a time zone" />
          </SelectTrigger>
          <SelectContent>
            {options?.map((tz, index) => (
              <SelectItem key={index} value={tz.value}>
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Update profile</Button>
    </form>
  );
}
