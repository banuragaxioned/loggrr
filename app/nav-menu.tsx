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
        denyAccess: ["GUEST"],
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
  { id: 3, title: "Reports", slug: "reports/logged", denyAccess: ["GUEST"] },
];

export function NavMenu({ role }: { role: string }) {
  const params = useParams();
  const { team } = params || {};

  const stopCollapse = (e: React.MouseEvent) => {
    if (e.detail === 0) return;
    e.preventDefault();
  };

  const isGuest = role === "GUEST";

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {NAV_ITEMS.map((item) => (
          <NavigationMenuItem key={item.id}>
            {item.subItems ? (
              <NavigationMenuTrigger onClick={stopCollapse}>
                {item.title}
                <NavigationMenuContent>
                  <ul className="grid gap-2 p-2 md:w-[350px] lg:grid-cols-1">
                    {item.subItems.map((subItem) => (
                      <Link key={subItem.id} href={`/${team}/${subItem.slug}`} legacyBehavior passHref>
                        <ListItem title={subItem.title}>{subItem.description}</ListItem>
                      </Link>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuTrigger>
            ) : (
              <Link href={`/${team}/${item.slug}`} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>{item.title}</NavigationMenuLink>
              </Link>
            )}
          </NavigationMenuItem>
        ))}
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
