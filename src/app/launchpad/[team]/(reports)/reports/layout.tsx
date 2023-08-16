import { notFound } from "next/navigation";

import { dashboardConfig } from "@/config/dashboard";
import { getCurrentUser } from "@/lib/session";
import { DashboardNav } from "@/components/nav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: 'Loggr',
    template: `%s | Reports | Loggr`,
  },
}

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  return (
    <>
      <div className="container grid gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav items={dashboardConfig.sidebarReports} />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </>
  );
}
