"use client";

import * as React from "react";
import {
  BarChart3,
  Briefcase,
  Folder,
  Home,
  MessageCircleQuestion,
  Settings2,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { OrganizationSwitcher } from "@/components/organization-switcher";
import { NavWorkspace } from "./nav-workspace";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Ask AI",
      url: "/ai",
      icon: Sparkles,
    },
  ],
  navWorkspace: [
    {
      name: "Clients",
      url: "clients",
      icon: Briefcase,
    },
    {
      name: "Projects",
      url: "projects",
      icon: Folder,
    },
    {
      name: "Members",
      url: "members",
      icon: Users,
    },
    {
      name: "Reports",
      url: "reports/logged",
      icon: BarChart3,
    },
  ],
  navSecondary: [
    {
      title: "Account",
      url: "/account",
      icon: User,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <OrganizationSwitcher />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavWorkspace links={data.navWorkspace} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
