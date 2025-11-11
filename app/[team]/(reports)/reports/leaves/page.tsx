import type { Metadata } from "next";
import { pageProps } from "@/types";

import { DashboardShell } from "@/components/ui/shell";
import { DashboardHeader } from "@/components/ui/shell";

import { getCurrentUser } from "@/server/session";
import { checkAccess, getUserRole } from "@/lib/helper";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { getLeave } from "@/server/services/leaves";
import LeaveDetails from "./leave-details";

export const metadata: Metadata = {
  title: `Leave Status`,
};

export default async function Page({ params, searchParams }: pageProps) {
  const user = await getCurrentUser();
  const workspaceRole = getUserRole(user?.workspaces, params.team);
  const rolesToDeny = ["GUEST"];
  const rolesToAllow = ["HR", "OWNER"];
  const grantAccess = checkAccess(workspaceRole, rolesToDeny, "deny");
  const hasAccess = checkAccess(workspaceRole, rolesToAllow, "allow");
  const memberId = searchParams.member;

  if (!user || !grantAccess) {
    return notFound();
  }

  const leaveData = await getLeave(params.team, memberId ? Number(memberId) : user.id);
  const leave = leaveData?.leave;
  const updatedAt = leaveData?.updatedAt;

  return (
    <DashboardShell>
      <div className="flex items-center justify-between gap-4">
        <DashboardHeader heading="Leave Status" text="View your leave status for the current year." />
        {hasAccess && (
          <Button asChild variant="outline">
            <Link href={`/${params.team}/reports/leaves/manage`}>
              <span className="font-medium">Manage</span> <ChevronRight size={16} />
            </Link>
          </Button>
        )}
      </div>
      <LeaveDetails leave={leave} updatedAt={updatedAt} />
    </DashboardShell>
  );
}
