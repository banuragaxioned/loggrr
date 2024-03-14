"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import timezones from "./timezones.json";

export function ProfileForm({ user }: { user: any }) {
  const [name, setName] = useState(user.name);
  const [timezone, setTimezone] = useState(user.timezone);

  async function onSubmit() {
    try {
      const response = await fetch("/api/manage/profile", {
        method: "PUT",
        body: JSON.stringify({
          id: user.id,
          name: name,
          timezone,
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
        <Select onValueChange={(value) => setTimezone(value)} defaultValue={user.timezone}>
          <SelectTrigger>
            <SelectValue placeholder="Select a time zone" />
          </SelectTrigger>
          <SelectContent>
            {timezones?.map((tz, index) => (
              <SelectItem key={index} value={tz.tzCode}>
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
