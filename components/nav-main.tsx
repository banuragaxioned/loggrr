"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}

export function NavMain({ items }: { items: NavMainItem[] }) {
  const pathname = usePathname();
  const { setOpenMobile, isMobile, state } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  function handleNavigate() {
    if (isMobile) setOpenMobile(false);
  }

  return (
    <SidebarGroup className="py-1">
      <SidebarGroupLabel className="h-6 text-[11px]">Navigation</SidebarGroupLabel>
      <SidebarMenu className="gap-0.5">
        {items.map((item) =>
          isCollapsed ? (
            <SidebarMenuItem key={item.title}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    isActive={item.isActive}
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    {item.icon && <item.icon />}
                    <span className="sr-only">{item.title}</span>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="right"
                  align="start"
                  sideOffset={12}
                  className="min-w-52 rounded-xl border-sidebar-border bg-sidebar p-1.5 text-sidebar-foreground shadow-lg"
                >
                  <DropdownMenuLabel className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    {item.icon && <item.icon className="size-3.5" />}
                    {item.title}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-sidebar-border" />
                  {item.items?.map((subItem) => {
                    const isActive = pathname === subItem.url || pathname.startsWith(`${subItem.url}/`);

                    return (
                      <DropdownMenuItem
                        key={subItem.title}
                        asChild
                        className={cn(
                          "cursor-pointer gap-2 rounded-lg px-2 py-2",
                          isActive && "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
                        )}
                      >
                        <Link href={subItem.url} onClick={handleNavigate}>
                          {subItem.icon && <subItem.icon className="size-4 opacity-70" />}
                          <span>{subItem.title}</span>
                          {isActive && <span className="ml-auto size-1.5 rounded-full bg-brand-fuchsia" />}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ) : (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton isActive={item.isActive}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const isActive = pathname === subItem.url || pathname.startsWith(`${subItem.url}/`);

                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild isActive={isActive}>
                            <Link href={subItem.url} onClick={handleNavigate}>
                              {subItem.icon && <subItem.icon />}
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
