import type { Metadata } from "next";
import { pageProps } from "@/types";

import { DashboardShell } from "@/components/ui/shell";
import { DashboardHeader } from "@/components/ui/shell";

import { getCurrentUser } from "@/server/session";
import { checkAccess, getUserRole } from "@/lib/helper";
import { notFound } from "next/navigation";
import Upload from "./upload";

export const metadata: Metadata = {
  title: `Send Leaves`,
};

export default async function Page({ params }: pageProps) {
  const user = await getCurrentUser();
  const workspaceRole = getUserRole(user?.workspaces, params.team);
  const denyAccess = ["GUEST", "USER", "INACTIVE"];
  const hasAccess = checkAccess(workspaceRole, denyAccess);
  const isAxionedMember = user?.email?.includes("@axioned.com") || false;

  if (!user || !hasAccess || !isAxionedMember) {
    return notFound();
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Send Leaves"
        text="Upload your team's leave status file and we'll send everyone an email with their current status."
      />
      <Upload />
    </DashboardShell>
  );
}
