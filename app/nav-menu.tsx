"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

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

const NAV_ITEMS = [
  {
    id: 1,
    title: "Projects",
    subItems: [
      {
        id: 1,
        title: "Projects",
        description: "Manage and view your projects.",
        slug: "projects",
        denyAccess: ["GUEST"], // Deny access to GUEST role, Add more if needed
      },
      {
        id: 2,
        title: "Clients",
        description: "View clients associated with your projects.",
        slug: "clients",
        denyAccess: ["GUEST"],
      },
    ],
  },
  {
    id: 2,
    title: "Members",
    subItems: [
      {
        id: 1,
        title: "Manage Members",
        description: "Manage members and their permissions.",
        slug: "members",
        denyAccess: ["GUEST"],
      },
      {
        id: 2,
        title: "Groups",
        description: "View various groups of members in the project.",
        slug: "groups",
        denyAccess: ["GUEST"],
      },
    ],
  },
  {
    id: 4,
    title: "Reports",
    subItems: [
      {
        id: 1,
        title: "Logged",
        description: "View the hours that are logged.",
        slug: "reports/logged",
        denyAccess: [""],
      },
      {
        id: 2,
        title: "Leaves",
        description: "View your leave status for the current year.",
        slug: "reports/leaves",
        denyAccess: ["GUEST"],
      },
    ],
  },
  // NOTE: Kept this for future use
  // { id: 3, title: "Reports", slug: "reports/logged", denyAccess: [""] },
];

export function NavMenu({ role }: { role: string }) {
  const params = useParams();
  const { team } = params || {};

  const stopCollapse = (e: React.MouseEvent) => {
    if (e.detail === 0) return;
    e.preventDefault();
  };

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {NAV_ITEMS.map((item) => {
          const isSubItemsPresent =
            item.subItems && item.subItems.filter((subItem) => !subItem.denyAccess.includes(role)).length > 0;

          return (
            <NavigationMenuItem key={item.id}>
              {isSubItemsPresent && (
                <NavigationMenuTrigger onClick={stopCollapse}>
                  {item.title}
                  <NavigationMenuContent>
                    <ul className="grid gap-2 p-2 md:w-[350px] lg:grid-cols-1">
                      {item.subItems
                        .filter((subItem) => !subItem.denyAccess.includes(role))
                        .map((subItem) => (
                          <ListItem key={subItem.id} href={`/${team}/${subItem.slug}`} title={subItem.title}>
                            {subItem.description}
                          </ListItem>
                        ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuTrigger>
              )}
              {/* NOTE: Kept this for future use */}
              {/* {!isSubItemsPresent && item.slug && !item.denyAccess.includes(role) && (
                <Link href={`/${team}/${item.slug}`} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>{item.title}</NavigationMenuLink>
                </Link>
              )} */}
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<React.ElementRef<typeof Link>, React.ComponentPropsWithoutRef<typeof Link>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = "ListItem";
