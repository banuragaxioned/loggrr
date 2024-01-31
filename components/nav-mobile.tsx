"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { NavItem } from "../types";
import { ThemeToggle } from "../app/theme-toggle";
import { useSession } from "next-auth/react";
import { UserAccountNav } from "./user-account";

interface MobileNavProps {
  items: NavItem[];
  children?: React.ReactNode;
  toggle: boolean;
  toggleFunction: (toggle: boolean) => void;
}

export function MobileNav({ items, children, toggle, toggleFunction }: MobileNavProps) {
  const { data: sessionData, status } = useSession();

  return (
    <div
      className={cn(
        "fixed inset-0 top-16 z-20 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto px-6 duration-300 animate-in slide-in-from-top-80",
      )}
    >
      <div className="relative z-20 grid gap-2 rounded-md border border-gray-500 bg-background p-4 shadow-md">
        <div className="flex justify-between border-b pb-2">
          <p className="flex items-center space-x-2">
            Hello,&nbsp;<span className="font-bold">{sessionData?.user.name}</span>
          </p>
          <div className="flex gap-2">
            <ThemeToggle />
            {status === "authenticated" && (
              <UserAccountNav
                user={{
                  name: sessionData.user.name,
                  image: sessionData.user.image,
                  email: sessionData.user.email,
                }}
              />
            )}
          </div>
        </div>
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? "#" : item.href}
              onClick={() => toggleFunction(!toggle)}
              className={cn(
                "flex w-full items-center rounded-md py-2 text-sm font-medium hover:underline",
                item.disabled && "cursor-not-allowed opacity-60",
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </div>
  );
}
