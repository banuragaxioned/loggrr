import type { Metadata } from "next";
import { pageProps } from "@/types";

import { DashboardShell } from "@/components/ui/shell";
import { DashboardHeader } from "@/components/ui/shell";

import { getCurrentUser } from "@/server/session";
import { checkAccess, getUserRole } from "@/lib/helper";
import { notFound } from "next/navigation";
import { getLeaves } from "@/server/services/leaves";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Leave Status`,
};

export default async function Page({ params, searchParams }: pageProps) {
  const user = await getCurrentUser();
  const workspaceRole = getUserRole(user?.workspaces, params.team);
  const rolesToDeny = ["GUEST"];
  const grantAccess = checkAccess(workspaceRole, rolesToDeny, "deny");

  console.log(grantAccess, "grantAccess");

  if (!user || !grantAccess) {
    return notFound();
  }

  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <DashboardHeader heading="Leave Status" text="View your leave status for the current year." />
        <Link href={`/${params.team}/reports/leaves/members`} className="flex items-center gap-2 hover:underline">
          <span className="font-medium">All members</span> <ChevronRight size={16} />
        </Link>
      </div>
    </DashboardShell>
  );
}
