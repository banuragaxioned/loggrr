"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { ChevronRight, LogOut, Menu, Settings } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { UserAccountNav } from "@/components/user-account";
import { UserAvatar } from "@/components/user-avatar";

interface UserPropsInterface {
  status: string | null | undefined;
  name: string | null | undefined;
  email: string | null | undefined;
  image: string | null | undefined;
}

export function MobileNavMenu({ userProps }: { userProps: UserPropsInterface }) {
  const params = useParams();
  const slug = params?.team;
  const { status, name, image, email } = userProps;

  const links = [
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
          title: "Assigned",
          description: "View how many hours have been logged.",
          href: `/${slug}/reports/logged`,
        },
        {
          id: 2,
          title: "Logged",
          description: "View who is assigned to what project.",
          href: `/${slug}/reports/assigned`,
        },
        {
          id: 3,
          title: "Available",
          description: "View who is available for work.",
          href: `/${slug}/reports/available`,
        },
      ],
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full p-0">
        <div className="flex items-center justify-between p-4">
          <ThemeToggle />
        </div>
        <div className="max-h-[calc(100vh-129px)] overflow-y-auto p-4">
          <ul className="flex flex-col space-y-4">
            {links.map((link) => (
              <li key={link.id}>
                {Array.isArray(link.subLinks) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center">
                        {link.title} <ChevronRight className="ml-2" size={18} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent avoidCollisions={false} align="start" className="sm:max-w-80">
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
                            <Link href={subLink.href}>
                              <SheetClose className="flex w-full flex-col space-y-1 p-1">
                                <p className="text-sm font-medium leading-none">{subLink.title}</p>
                                <span className="line-clamp-2 text-left text-sm leading-snug text-muted-foreground">
                                  {subLink.description}
                                </span>
                              </SheetClose>
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </li>
            ))}
          </ul>
        </div>
        {/* Avatar area */}
        {status === "authenticated" && (
          <div className="absolute bottom-0 left-0 flex w-full items-center border-t px-3 py-2">
            <UserAvatar user={{ name: name ?? null, image: image ?? null }} className="h-10 w-10 bg-slate-300" />
            <div className="ml-2">
              <p className="font-medium">{name}</p>
              <p className="w-[200px] truncate text-sm text-zinc-600 dark:text-zinc-100">{email}</p>
            </div>
            {/* CTAs */}
            <div className="ml-auto flex gap-2">
              <Button variant="outline" size="icon" asChild>
                <Link href="/manage">
                  <SheetClose>
                    <Settings size={20} />
                  </SheetClose>
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  signOut({
                    callbackUrl: `${window.location.origin}/`,
                  })
                }
              >
                <SheetClose>
                  <LogOut size={20} />
                </SheetClose>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
