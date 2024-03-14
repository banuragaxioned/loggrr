import { getCurrentUser } from "@/server/session";

import { DashboardShell } from "@/components/ui/shell";

import { ProfileForm } from "./profile-form";
import { Appearance } from "./appearance";

export default async function Manage() {
  const user = await getCurrentUser();

  return (
    <DashboardShell>
      <h2>Your profile</h2>
      <ProfileForm user={user} />
      <h2>Appearance</h2>
      <Appearance />
    </DashboardShell>
  );
}
