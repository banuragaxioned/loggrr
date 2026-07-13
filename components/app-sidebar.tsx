"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { User } from "next-auth";
import { Role } from "@/generated/prisma/browser";

import { NAV_ITEMS } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import { CommandMenu } from "@/components/command-action";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { Logo } from "@/components/ui/logo";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import TeamSwitcher from "@/app/team-switcher";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role: string;
  user: Pick<User, "name" | "image" | "email">;
  teams?: {
    id: number;
    name: string;
    slug: string;
    role: Role;
  }[];
  isLoading?: boolean;
}

export function AppSidebar({ role, user, teams, isLoading, className, ...props }: AppSidebarProps) {
  const params = useParams();
  const pathname = usePathname();
  const team = params?.team ? decodeURIComponent(params.team as string) : undefined;

  const navItems = NAV_ITEMS.map((item) => {
    const items = item.items
      .filter((subItem) => !subItem.denyAccess.includes(role))
      .map((subItem) => ({
        title: subItem.title,
        url: team ? `/${team}/${subItem.slug}` : `/${subItem.slug}`,
        icon: subItem.icon,
      }));

    const isActive = items.some((subItem) => pathname === subItem.url || pathname.startsWith(`${subItem.url}/`));

    return {
      title: item.title,
      url: items[0]?.url ?? "#",
      icon: item.icon,
      isActive,
      items,
    };
  }).filter((item) => item.items.length > 0);

  return (
    <Sidebar collapsible="icon" className={cn(className)} {...props}>
      <SidebarHeader className="gap-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={siteConfig.name}
              className="h-auto py-1.5 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:justify-center! group-data-[collapsible=icon]:p-2!"
            >
              <Link href={team ? `/${team}` : "/"} aria-label={siteConfig.name}>
                <span className="origin-left scale-[0.8] group-data-[collapsible=icon]:hidden!">
                  <Logo className="gap-2" />
                </span>
                <span className="hidden size-5 shrink-0 group-data-[collapsible=icon]:block!">
                  <Logo variant="mark" className="size-5" />
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {teams && teams.length > 0 && (
          <div className="px-2 pb-1 group-data-[collapsible=icon]:hidden">
            <TeamSwitcher teams={teams} className="w-full min-w-0" />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        {isLoading ? (
          <div className="flex flex-col gap-2 p-2 group-data-[collapsible=icon]:items-center">
            <Skeleton className="h-8 w-full group-data-[collapsible=icon]:size-8" />
            <Skeleton className="h-8 w-full group-data-[collapsible=icon]:size-8" />
            <Skeleton className="h-8 w-full group-data-[collapsible=icon]:size-8" />
          </div>
        ) : (
          <NavMain items={navItems} />
        )}
      </SidebarContent>
      <SidebarFooter>
        {teams && !isLoading && (
          <>
            <CommandMenu teams={teams} slug={team || ""} variant="sidebar" />
            <SidebarSeparator className="mx-0" />
          </>
        )}
        {isLoading ? (
          <div className="flex items-center gap-2 p-2 group-data-[collapsible=icon]:justify-center">
            <Skeleton className="size-8 rounded-full" />
            <div className="grid flex-1 gap-1 group-data-[collapsible=icon]:hidden">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        ) : (
          <NavUser user={user} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
