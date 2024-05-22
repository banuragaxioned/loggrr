import { notFound } from "next/navigation";
import { ClipboardCheck, Milestone as CategoryIcon, TextSearch, Users } from "lucide-react";

import { getCurrentUser } from "@/server/session";
import { SidebarNavItem, projectProps } from "@/types";
import { SecondaryNavigation } from "./components/secondary-nav";
import { db } from "@/server/db";
import { PageBreadcrumb } from "./components/page-breadcrumb";
import { DashboardShell } from "@/components/ui/shell";
import TimeLoggedCard from "./components/timelogged-card";
import BillableCard from "./components/billable-card";
import { TeamsCard } from "./components/teams-card";

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

  const members = await db.project.findUnique({
    where: {
      id: +projectId,
    },
    select: {
      usersOnProject: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            },
          },
        },
      },
    },
  });

  const allMembers = members?.usersOnProject
    .filter((member) => member.user.name || member.user.image)
    .map((member) => ({
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
      image: member.user.image,
    }));

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

  return (
    <main className="col-span-12 flex flex-col gap-3 lg:col-span-9">
      <div className="flex flex-col items-start justify-between gap-3 lg:flex-row lg:items-end">
        <PageBreadcrumb projectDetails={projectDetails} slug={slug} />
        <SecondaryNavigation items={tabList} />
      </div>
      <DashboardShell>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-9">{children}</div>
          <div className="col-span-12 flex flex-col gap-4 lg:col-span-3">
            <TimeLoggedCard timecardProp={timecardProp} />
            <BillableCard timecardProp={billableCardProp} />
            <TeamsCard items={allMembers} activeUserCount={userActivity.length} />
          </div>
        </div>
      </DashboardShell>
    </main>
  );
}
