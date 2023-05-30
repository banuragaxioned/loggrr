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
      href: "/members",
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
      title: "Billing",
      href: "/billing",
      icon: "billing",
    },
    {
      title: "Profile",
      href: "/profile",
      icon: "user",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: "settings",
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
    {
      title: "Settings",
      href: "/skills/settings",
      icon: "settings",
    },
  ],
};
