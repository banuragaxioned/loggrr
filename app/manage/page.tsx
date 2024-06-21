import { getCurrentUser } from "@/server/session";

import { DashboardShell } from "@/components/ui/shell";

import { ProfileForm } from "./profile-form";
import { Appearance } from "./appearance";
import { db } from "@/server/db";
import { findUserById } from "../_actions/user-management";

export default async function Manage() {
  const user = await getCurrentUser();
  const userDetails = await findUserById(user?.id || 0);

  return (
    <DashboardShell>
      <h2>Your profile</h2>
      <ProfileForm user={userDetails} />
      <h2>Appearance</h2>
      <Appearance />
    </DashboardShell>
  );
}
