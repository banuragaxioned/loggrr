import { notFound } from "next/navigation";
import { ClipboardCheck, Milestone as CategoryIcon, TextSearch, Users } from "lucide-react";

import { getCurrentUser } from "@/server/session";
import { SidebarNavItem, projectProps } from "@/types";
import { SecondaryNavigation } from "./secondary-nav";
import { db } from "@/server/db";
import { PageBreadcrumb } from "./page-breadcrumb";

interface DashboardLayoutProps extends projectProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const user = await getCurrentUser();
  const projectId = params?.project;
  const slug = params.team;

  const tabList: SidebarNavItem[] = [
    {
      title: "Overview",
      href: `/${slug}/projects/${projectId}`,
      icon: <TextSearch size={16} className="hidden sm:block" />,
    },
    {
      title: "Categories",
      href: `/${slug}/projects/${projectId}/categories`,
      icon: <CategoryIcon size={16} className="hidden sm:block" />,
    },
    {
      title: "Tasks",
      href: `/${slug}/projects/${projectId}/tasks`,
      icon: <ClipboardCheck size={16} className="hidden sm:block" />,
    },
    {
      title: "Members",
      href: `/${slug}/projects/${projectId}/members`,
      icon: <Users size={16} className="hidden sm:block" />,
    },
  ];

  if (!user) {
    return notFound();
  }

  const projectDetails = await db.project.findUnique({
    where: {
      id: +projectId,
      workspace: {
        slug,
      },
    },
    select: {
      name: true,
      client: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!projectDetails) {
    return notFound();
  }

  return (
    <main className="col-span-12 flex flex-col gap-3 lg:col-span-9">
      <div className="flex flex-col items-start justify-between gap-3 lg:flex-row lg:items-end">
        <PageBreadcrumb projectDetails={projectDetails} slug={slug} />
        <SecondaryNavigation items={tabList} />
      </div>
      {children}
    </main>
  );
}
