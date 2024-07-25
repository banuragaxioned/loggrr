"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { toast } from "sonner";

export function NavMenu() {
  const params = useParams();
  const slug = params?.team;

  const stopCollapse = (e: React.MouseEvent) => {
    if (e.detail === 0) return;
    e.preventDefault();
  };

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger onClick={stopCollapse}>Projects</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 p-2 md:w-[350px] lg:grid-cols-1">
              <Link href={`/${slug}/projects`} legacyBehavior passHref>
                <ListItem title="Projects">Manage and view your projects.</ListItem>
              </Link>
              <Link href={`/${slug}/clients`} legacyBehavior passHref>
                <ListItem title="Clients">View clients associated with your projects.</ListItem>
              </Link>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger onClick={stopCollapse}>Members</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 p-2 md:w-[350px] lg:grid-cols-1">
              <Link href={`/${slug}/members`} legacyBehavior passHref>
                <ListItem title="Manage Members">Manage members and their permissions.</ListItem>
              </Link>
              <Link href={`/${slug}/groups`} legacyBehavior passHref>
                <ListItem title="Groups">View various groups of members in the project.</ListItem>
              </Link>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {/*
          // TODO: Commenting for future use
         */}
        {/* <NavigationMenuItem>
          <NavigationMenuTrigger onClick={stopCollapse}>Skills</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 p-2 md:w-[460px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <div className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                    <div className="mb-2 mt-4 text-lg font-medium">Skills</div>
                    <p className="text-sm leading-tight text-muted-foreground">View and manage your skills.</p>
                  </div>
                </NavigationMenuLink>
              </li>
              <Link href={`/${slug}/skills/summary`} legacyBehavior passHref>
                <ListItem title="Summary">View and manage your skills.</ListItem>
              </Link>
              <Link href={`/${slug}/skills/explore`} legacyBehavior passHref>
                <ListItem title="Explore">View all skills.</ListItem>
              </Link>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem> */}
        <NavigationMenuItem>
          <Link href="" passHref onClick={() => {
            toast.error("Global Reports is temporarily unavailable. Please use Project Details page for now.")
          }}>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Reports</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = "ListItem";
