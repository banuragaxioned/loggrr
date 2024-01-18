"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MobileNavMenu() {
  const params = useParams();
  const slug = params?.team;

  const links = [
    {
      id: 1,
      title: "Home",
      href: `/${slug}`,
    },
    {
      id: 2,
      title: "Projects",
      subLinks: [
        {
          id: 1,
          title: "Projects",
          description: "Manage and view your projects.",
          href: `/${slug}/projects`,
        },
        {
          id: 2,
          title: "Clients",
          description: "View clients associated with your projects.",
          href: `/${slug}/clients`,
        },
      ],
    },
    {
      id: 3,
      title: "Members",
      subLinks: [
        {
          id: 1,
          title: "Manage Members",
          description: "Manage members and their permissions.",
          href: `/${slug}/members`,
        },
        {
          id: 2,
          title: "Groups",
          description: "View various groups of members in the project.",
          href: `/${slug}/groups`,
        },
      ],
    },
    {
      id: 4,
      title: "Skills",
      subLinkTitle: "Skills",
      subLinkDescription: "View and manage your skills.",
      subLinks: [
        {
          id: 1,
          title: "Summary",
          description: "View and manage your skills.",
          href: `/${slug}/skills/summary`,
        },
        {
          id: 2,
          title: "Explore",
          description: "View all skills.",
          href: `/${slug}/skills/explore`,
        },
        {
          id: 3,
          title: "Report",
          description: "Explore roadmap and skills.",
          href: `/${slug}/skills/report`,
        },
      ],
    },
    {
      id: 5,
      title: "Reports",
      subLinkTitle: "Reporting",
      subLinkDescription: "View and download reports for your projects and teams.",
      subLinks: [
        {
          id: 1,
          title: "Summary",
          description: "View who is assigned to what project.",
          href: `/${slug}/reports/summary`,
        },
        {
          id: 2,
          title: "Logged",
          description: "View who is assigned to what project.",
          href: `/${slug}/reports/assigned`,
        },
        {
          id: 3,
          title: "Assigned",
          description: "View how many hours have been logged.",
          href: `/${slug}/reports/logged`,
        },
        {
          id: 4,
          title: "Available",
          description: "View who is available for work.",
          href: `/${slug}/reports/available`,
        },
      ],
    },
  ];

  const renderLinks = links.map((link) => (
    <li key={link.id}>
      {Array.isArray(link.subLinks) ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center">
              {link.title} <ChevronRight className="ml-2" size={18} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" sticky="always">
            {link.subLinkTitle && (
              <>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-3 rounded-sm bg-gradient-to-b from-muted/50 to-muted px-2 py-4">
                    <p className="text-base font-medium leading-none">{link.subLinkTitle}</p>
                    <span className="line-clamp-2 text-sm font-normal leading-snug text-muted-foreground">
                      {link.subLinkDescription}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuGroup>
              {link.subLinks.map((subLink) => (
                <DropdownMenuItem key={subLink.id}>
                  <Link href={subLink.href} legacyBehavior passHref>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{subLink.title}</p>
                      <span className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {subLink.description}
                      </span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href={`/${slug}`} legacyBehavior passHref>
          Home
        </Link>
      )}
    </li>
  ));

  return (
    <div className="mt-6">
      <ul className="flex flex-col space-y-4">{renderLinks}</ul>
    </div>
  );
}
