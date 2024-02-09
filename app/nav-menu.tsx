"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useParams } from "next/navigation";
import Link from "next/link";

export function NavMenu() {
  const params = useParams();
  const slug = params?.team;

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Projects</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[350px] lg:grid-cols-1">
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
          <NavigationMenuTrigger>Members</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[350px] lg:grid-cols-1">
              <Link href={`/${slug}/members`} legacyBehavior passHref>
                <ListItem title="Manage Members">Manage members and their permissions.</ListItem>
              </Link>
              <Link href={`/${slug}/groups`} legacyBehavior passHref>
                <ListItem title="Groups">View various groups of members in the project.</ListItem>
              </Link>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Skills</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[500px] lg:grid-cols-[.75fr_1fr]">
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
              <Link href={`/${slug}/skills/report`} legacyBehavior passHref>
                <ListItem title="Report">Explore roadmap and skills.</ListItem>
              </Link>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Reports</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[600px] lg:grid-cols-3">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <div className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                    <div className="mb-2 mt-4 text-lg font-medium">Reporting</div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      View and download reports for your projects and teams.
                    </p>
                  </div>
                </NavigationMenuLink>
              </li>
              <Link href={`/${slug}/reports/assigned`} legacyBehavior passHref>
                <ListItem title="Assigned">View who is assigned to what project.</ListItem>
              </Link>
              <Link href={`/${slug}/reports/logged`} legacyBehavior passHref>
                <ListItem title="Logged">View how many hours have been logged.</ListItem>
              </Link>
              <Link href={`/${slug}/reports/available`} legacyBehavior passHref>
                <ListItem title="Available">View who is available for work.</ListItem>
              </Link>
            </ul>
          </NavigationMenuContent>
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
