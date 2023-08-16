import { DashboardConfig } from "@/types";

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Support",
      href: "/support",
      disabled: true,
    },
  ],
  sidebarProjects: [
    {
      title: "Milestones",
      href: "/milestones",
      icon: "post",
    },
    {
      title: "Tasks",
      href: "/tasks",
      icon: "billing",
    },
    {
      title: "Members",
      href: "/manage/members",
      icon: "user",
    },
    {
      title: "Manage",
      href: "/manage",
      icon: "settings",
    },
  ],
  sidebarTeam: [
    {
      title: "Clients",
      href: "/clients",
      icon: "post",
    },
    {
      title: "Projects",
      href: "/projects",
      icon: "post",
    },
    {
      title: "Members",
      href: "/manage/members",
      icon: "user",
    },
  ],
  sidebarSkills: [
    {
      title: "Summary",
      href: "/skills/summary",
      icon: "user",
    },
    {
      title: "Explore",
      href: "/skills/explore",
      icon: "post",
    },
    {
      title: "Report",
      href: "/skills/report",
      icon: "billing",
    },
  ],
  sidebarReports: [
    {
      title: "Summary",
      href: "/reports/summary",
      icon: "user",
    },
    {
      title: "Assigned",
      href: "/reports/assigned",
      icon: "post",
    },
    {
      title: "Logged",
      href: "/reports/logged",
      icon: "settings",
    },
    {
      title: "Available",
      href: "/reports/available",
      icon: "billing",
    },
  ],
};
