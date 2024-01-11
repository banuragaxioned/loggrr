import { notFound } from "next/navigation";
import { getCurrentUser } from "lib/session";
import { DashboardNav } from "components/nav";
import { SidebarNavItem, projectProps } from "types";
import { CreditCard, FileText, HomeIcon, User } from "lucide-react";

interface DashboardLayoutProps extends projectProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const user = await getCurrentUser();
  const projectId = params?.project;
  const slug = params.team;

  const sidebarProjectsList: SidebarNavItem[] = [
    {
      title: "Overview",
      href: `/${slug}/projects/${projectId}/`,
      icon: <HomeIcon height={18} width={18} />,
    },
    {
      title: "Milestones",
      href: `/${slug}/projects/${projectId}/milestones`,
      icon: <FileText height={18} width={18} />,
    },
    {
      title: "Tasks",
      href: `/${slug}/projects/${projectId}/tasks`,
      icon: <CreditCard height={18} width={18} />,
    },
    {
      title: "Members",
      href: `/${slug}/projects/${projectId}/members`,
      icon: <User height={18} width={18} />,
    },
  ];

  if (!user) {
    return notFound();
  }

  return (
    <div className="grid gap-12 md:grid-cols-[200px_1fr]">
      <aside className="hidden w-[200px] flex-col md:flex">
        <DashboardNav items={sidebarProjectsList} />
      </aside>
      <main className="flex w-full flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}
