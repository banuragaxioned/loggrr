import React from "react";
import { notFound } from "next/navigation";

import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import { getCurrentUser } from "@/server/session";
import { pageProps } from "@/types";
import { ProfileForm } from "./profile";

export default async function Manage({ params }: pageProps) {
  const user = await getCurrentUser();
  const { team } = params;

  return (
    <DashboardShell>
      <h2>Your profile</h2>
      <ProfileForm user={user} team={team} />
    </DashboardShell>
  );
}
