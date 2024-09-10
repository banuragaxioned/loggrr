import { notFound } from "next/navigation";

import { dashboardConfig } from "@/config/dashboard";
import { getCurrentUser } from "@/server/session";
import { DashboardNav } from "@/components/nav";
import { SidebarNavItem } from "@/types";
import { CreditCard, FileTextIcon, User } from "lucide-react";
import { checkAccess, getUserRole } from "@/lib/helper";

interface DashboardLayoutProps {
  children?: React.ReactNode;
  params: { team: string };
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const { team } = params;
  const user = await getCurrentUser();
  const workspaceRole = getUserRole(user?.workspaces, team);
  const hasAccess = checkAccess(workspaceRole);

  if (!user || !hasAccess) {
    return notFound();
  }

  return (
    <div className="container grid gap-12 md:grid-cols-1">
      <main className="flex w-full flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}
