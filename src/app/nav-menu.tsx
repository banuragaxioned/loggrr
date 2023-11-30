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
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { useParams } from "next/navigation";
import Link from "next/link";

export function NavMenu() {
  const params = useParams();
  const slug = params?.team;

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href={`/${slug}`} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Projects</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[350px] lg:grid-cols-1">
              <ListItem href={`/${slug}/projects`} title="Projects">
                Manage and view your projects.
              </ListItem>
              <ListItem href={`/${slug}/clients`} title="Clients">
                View clients associated with your projects.
              </ListItem>
              <ListItem href={`/${slug}/usergroup`} title="Groups">
                View various groups of members in the project.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Members</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[350px] lg:grid-cols-1">
              <ListItem href={`/${slug}/manage/members`} title="Manage Members">
                Manage members and their permissions.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Skills</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <div
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">Skills</div>
                    <p className="text-sm leading-tight text-muted-foreground">View and manage your skills.</p>
                  </div>
                </NavigationMenuLink>
              </li>
              <ListItem href={`/${slug}/skills/summary`} title="Summary">
                View and manage your skills.
              </ListItem>
              <ListItem href={`/${slug}/skills/explore`} title="Explore">
                View all skills.
              </ListItem>
              <ListItem href={`/${slug}/skills/report`} title="Report">
                Explore roadmap and skills.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Reports</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[600px] lg:grid-cols-3">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <div
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">Reporting</div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      View and download reports for your projects and teams.
                    </p>
                  </div>
                </NavigationMenuLink>
              </li>
              <ListItem href={`/${slug}/reports/summary`} title="Summary">
                View who is assigned to what project.
              </ListItem>
              <ListItem href={`/${slug}/reports/assigned`} title="Assigned">
                View who is assigned to what project.
              </ListItem>
              <ListItem href={`/${slug}/reports/logged`} title="Logged">
                View how many hours have been logged.
              </ListItem>
              <ListItem href={`/${slug}/reports/available`} title="Available">
                View who is available for work.
              </ListItem>
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
