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

export function NavMenu() {
  const params = useParams();
  const slug = String(params.team);

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
        <NavigationMenuItem>
          <Link href={`/${slug}/reports/logged`} legacyBehavior passHref>
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
