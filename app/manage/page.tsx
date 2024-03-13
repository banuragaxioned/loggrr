import React from "react";

import { DashboardShell } from "@/components/ui/shell";
import { getCurrentUser } from "@/server/session";
import { ProfileForm } from "./profile";

export default async function Manage() {
  const user = await getCurrentUser();

  return (
    <DashboardShell>
      <h2>Your profile</h2>
      <ProfileForm user={user} />
    </DashboardShell>
  );
}
