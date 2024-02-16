import { notFound } from "next/navigation";
import { getCurrentUser } from "@/server/session";
import { DashboardNav } from "@/components/nav";
import { SidebarNavItem, projectProps } from "@/types";
import { ClipboardCheck, Milestone, TextSearch, Users } from "lucide-react";
import { SecondaryNavigation } from "./secondary-nav";

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
      href: `/${slug}/projects/${projectId}`,
      icon: <TextSearch height={18} width={18} />,
    },
    {
      title: "Milestones",
      href: `/${slug}/projects/${projectId}/milestones`,
      icon: <Milestone height={18} width={18} />,
    },
    {
      title: "Tasks",
      href: `/${slug}/projects/${projectId}/tasks`,
      icon: <ClipboardCheck height={18} width={18} />,
    },
    {
      title: "Members",
      href: `/${slug}/projects/${projectId}/members`,
      icon: <Users height={18} width={18} />,
    },
  ];

  if (!user) {
    return notFound();
  }

  return (
    <main className="col-span-12 flex flex-col gap-4 lg:col-span-9">
      <SecondaryNavigation items={sidebarProjectsList} />
      {children}
    </main>
  );
}
