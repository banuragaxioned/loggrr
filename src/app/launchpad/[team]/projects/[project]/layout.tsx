import { notFound } from "next/navigation";
import { dashboardConfig } from "@/config/dashboard";
import { getCurrentUser } from "@/lib/session";
import { DashboardNav } from "@/components/nav";
import { SidebarNavItem, projectProps } from "@/types";

interface DashboardLayoutProps extends projectProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const user = await getCurrentUser();
  const projectId = params?.project;

  const sidebarProjectsList: SidebarNavItem[] = [
    {
      title: "Milestones",
      href: `/projects/${projectId}/milestones`,
      icon: "post",
    },
    {
      title: "Tasks",
      href: `/projects/${projectId}/tasks`,
      icon: "billing",
    },
    {
      title: "Members",
      href: `/projects/${projectId}/members`,
      icon: "user",
    },
  ]

  if (!user) {
    return notFound();
  }

  return (
    <div className="container grid gap-12 md:grid-cols-[200px_1fr]">
      <aside className="hidden w-[200px] flex-col md:flex">
        <DashboardNav items={sidebarProjectsList} />
      </aside>
      <div className="flex w-full flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  );
}