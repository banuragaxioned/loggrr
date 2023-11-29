import { notFound } from "next/navigation";

import { dashboardConfig } from "@/config/dashboard";
import { getCurrentUser } from "@/lib/session";
import { DashboardNav } from "@/components/nav";
import { SidebarNavItem } from "@/types";
import { CreditCard, FileTextIcon, User, Settings } from "lucide-react";

interface DashboardLayoutProps {
  children?: React.ReactNode;
  params: string;
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  const sidebarReports: SidebarNavItem[] = [
    {
      title: "Summary",
      href: "/reports/summary",
      icon: <User height={18} width={18} />,
    },
    {
      title: "Assigned",
      href: "/reports/assigned",
      icon: <FileTextIcon height={18} width={18} />,
    },
    {
      title: "Logged",
      href: "/reports/logged",
      icon: <Settings height={18} width={18} />,
    },
    {
      title: "Available",
      href: "/reports/available",
      icon: <CreditCard height={18} width={18} />,
    },
  ];

  return (
    <>
      <div className="container grid gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav items={sidebarReports} />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </>
  );
}
