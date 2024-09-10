import { notFound } from "next/navigation";
import { ClipboardCheck, Milestone as CategoryIcon, TextSearch, Users } from "lucide-react";

import { db } from "@/server/db";
import { getCurrentUser } from "@/server/session";
import { getMembersByProject, getProjectDetailsById } from "@/server/services/project";

import { SidebarNavItem, projectProps } from "@/types";

import { SecondaryNavigation } from "./components/secondary-nav";
import { DashboardShell } from "@/components/ui/shell";

import PageBreadcrumb from "./components/page-breadcrumb";
import TimeLoggedCard from "./components/timelogged-card";
import BillableCard from "./components/billable-card";
import TeamsCard from "./components/teams-card";
import { checkAccess, getUserRole } from "@/lib/helper";

interface DashboardLayoutProps extends projectProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const user = await getCurrentUser();
  const { project: projectId, team: slug } = params;
  const workspaceRole = getUserRole(user?.workspaces, slug);
  const hasAccess = checkAccess(workspaceRole);

  if (!user || !projectId || !hasAccess) {
    return notFound();
  }

  const projectDetails = await getProjectDetailsById(slug, +projectId);

  if (!projectDetails?.name) {
    return notFound();
  }

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

  const timeLogOverall = await db.timeEntry.groupBy({
    by: ["projectId"],
    where: {
      workspace: {
        slug,
      },
      projectId: +projectId,
    },
    _sum: {
      time: true,
    },
  });

  const timeLogLast30 = await db.timeEntry.groupBy({
    by: ["projectId"],
    where: {
      workspace: {
        slug,
      },
      projectId: +projectId,
      date: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    _sum: {
      time: true,
    },
  });

  const billable = await db.timeEntry.groupBy({
    by: ["projectId"],
    where: {
      workspace: {
        slug,
      },
      projectId: +projectId,
      date: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      billable: true,
    },
    _sum: {
      time: true,
    },
  });

  const timecardProp = {
    overall: timeLogOverall[0]?._sum.time ?? 0,
    last30: timeLogLast30[0]?._sum.time ?? 0,
  };

  const billableCardProp = {
    last30: timeLogLast30[0]?._sum.time ?? 0,
    billable: billable[0]?._sum.time ?? 0,
  };

  const allMembers = await getMembersByProject(slug, +projectId);

  // Get last 30 days active users
  const userActivity = await db.timeEntry.groupBy({
    by: ["userId"],
    where: {
      workspace: {
        slug,
      },
      projectId: +projectId,
      date: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
  });

  const isBillable = projectDetails?.billable ?? false;

  return (
    <main className="col-span-12 flex flex-col gap-3 lg:col-span-9">
      <div className="flex flex-col items-start justify-between gap-3 lg:flex-row lg:items-end">
        <PageBreadcrumb projectDetails={projectDetails} slug={slug} />
        <SecondaryNavigation items={tabList} />
      </div>
      <DashboardShell>
        <div className="flex w-full flex-wrap items-start gap-4 lg:flex-nowrap">
          <div className="w-full lg:w-[75%]">{children}</div>
          <div className="top-[70px] flex w-full flex-col gap-4 overflow-y-auto lg:sticky lg:max-h-[calc(100vh-80px)] lg:w-[25%]">
            <TimeLoggedCard timecardProp={timecardProp} />
            {isBillable && <BillableCard timecardProp={billableCardProp} />}
            <TeamsCard items={allMembers} activeUserCount={userActivity.length} />
          </div>
        </div>
      </DashboardShell>
    </main>
  );
}
