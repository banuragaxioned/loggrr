import { DashboardConfig } from "@/types";
import { BoxesIcon, CreditCard, FileTextIcon, Settings, User } from "lucide-react";

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
  sidebarProfile: [
    {
      title: "Account",
      href: "/account",
    },
    {
      title: "Appearance",
      href: "/appearance",
    },
    {
      title: "Notifications",
      href: "/notifications",
    },
  ],
  sidebarProjects: [
    {
      title: "Milestones",
      href: "/milestones",
      // icon: FileTextIcon,
    },
    {
      title: "Tasks",
      href: "/tasks",
      // icon: CreditCard,
    },
    {
      title: "Members",
      href: "/manage/members",
      // icon: User,
    },
    {
      title: "Manage",
      href: "/manage",
      // icon: Settings,
    },
  ],
  sidebarTeam: [
    {
      title: "Clients",
      href: "/clients",
      // icon: FileTextIcon,
    },
    {
      title: "Projects",
      href: "/projects",
      // icon: FileTextIcon,
    },
    {
      title: "Members",
      href: "/manage/members",
      // icon: User,
    },
    {
      title: "Groups",
      href: "/usergroup",
      // icon: BoxesIcon,
    },
  ],
  sidebarSkills: [
    {
      title: "Summary",
      href: "/skills/summary",
      // icon: User,
    },
    {
      title: "Explore",
      href: "/skills/explore",
      // icon: FileTextIcon,
    },
    {
      title: "Report",
      href: "/skills/report",
      // icon: CreditCard,
    },
  ],
  sidebarReports: [
    {
      title: "Summary",
      href: "/reports/summary",
      // icon: User,
    },
    {
      title: "Assigned",
      href: "/reports/assigned",
      // icon: FileTextIcon,
    },
    {
      title: "Logged",
      href: "/reports/logged",
      // icon: Settings,
    },
    {
      title: "Available",
      href: "/reports/available",
      // icon: CreditCard,
    },
  ],
};
