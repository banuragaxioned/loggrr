import { notFound } from "next/navigation";

import { dashboardConfig } from "@/config/dashboard";
import { getCurrentUser } from "@/lib/session";
import { DashboardNav } from "@/components/nav";
import { SidebarNavItem } from "@/types";
import { CreditCard, FileTextIcon, User } from "lucide-react";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  const sidebarSkills: SidebarNavItem[] = [
    {
      title: "Summary",
      href: "/skills/summary",
      icon: <User height={18} width={18} />,
    },
    {
      title: "Explore",
      href: "/skills/explore",
      icon: <FileTextIcon height={18} width={18} />,
    },
    {
      title: "Report",
      href: "/skills/report",
      icon: <CreditCard height={18} width={18} />,
    },
  ];

  return (
    <>
      <div className="container grid gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav items={sidebarSkills} />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </>
  );
}
