"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { ChevronRight, LogOut, Menu, Settings } from "lucide-react";

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface UserPropsInterface {
  status: string | null | undefined;
  name: string | null | undefined;
  email: string | null | undefined;
  image: string | null | undefined;
}

const NAV_ITEMS = [
  {
    id: 1,
    title: "Projects",
    subItems: [
      {
        id: 1,
        title: "Projects",
        description: "Track project status, budgets, and ownership.",
        slug: `projects`,
        denyAccess: ["GUEST"], // Deny access to GUEST role, Add more if needed
      },
      {
        id: 2,
        title: "Clients",
        description: "Manage client profiles linked to your projects.",
        slug: `clients`,
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
        description: "Manage workspace members, roles, and permissions.",
        slug: `members`,
        denyAccess: ["GUEST"],
      },
      {
        id: 2,
        title: "Groups",
        description: "Organize members into groups for filtering and reporting.",
        slug: `groups`,
        denyAccess: ["GUEST"],
      },
    ],
  },
  {
    id: 3,
    title: "Reports",
    subLinkTitle: "Reporting",
    subLinkDescription: "View and download reports for your projects and teams.",
    subItems: [
      {
        id: 1,
        title: "Logged",
        description: "Analyze logged hours by member, group, and project.",
        slug: "reports/logged",
        denyAccess: [""],
      },
      {
        id: 2,
        title: "Leaves",
        description: "Review your yearly leave status.",
        slug: "reports/leaves",
        denyAccess: ["GUEST"],
      },
    ],
  },
];

export function MobileNavMenu({ userProps, role }: { userProps: UserPropsInterface; role: string }) {
  const params = useParams();
  const { team } = params || {};
  const { status, name, image, email } = userProps;

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
        <SheetTitle />
        <SheetDescription />
        <div className="max-h-[calc(100vh-129px)] overflow-y-auto p-4">
          <Accordion type="single" collapsible className="w-full">
            {NAV_ITEMS.map((item, index) => {
              const isSubItemsPresent =
                item.subItems && item.subItems.filter((subItem) => !subItem.denyAccess.includes(role)).length > 0;

              return (
                isSubItemsPresent && (
                  <AccordionItem
                    key={item.id}
                    value={`${item.id}`}
                    className={cn(index === NAV_ITEMS.length - 1 && "border-none")}
                  >
                    <AccordionTrigger className="py-2 font-normal hover:no-underline">
                      <span className="text-base">{item.title}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-1 [&_a]:no-underline [&_a]:underline-offset-0 [&_a]:hover:no-underline">
                      {item.subItems
                        .filter((subItem) => !subItem.denyAccess.includes(role))
                        .map((subItem) => (
                          <Link
                            href={`/${team}/${subItem.slug}`}
                            key={subItem.id}
                            className="block no-underline hover:no-underline focus:no-underline"
                          >
                            <SheetClose className="flex w-full items-start gap-2 py-1.5">
                              <ChevronRight size={16} className="mt-[2px] shrink-0 opacity-50" />
                              <div className="w-full text-left">
                                <p className="mb-1! text-sm leading-none font-medium">{subItem.title}</p>
                                <span className="text-muted-foreground line-clamp-2 text-left text-sm leading-snug">
                                  {subItem.description}
                                </span>
                              </div>
                            </SheetClose>
                          </Link>
                        ))}
                    </AccordionContent>
                  </AccordionItem>
                )
              );
            })}
          </Accordion>
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
                asChild
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
