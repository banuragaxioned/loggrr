"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import posthog from "posthog-js";
import { Clock, Loader, Menu } from "lucide-react";

import { siteConfig } from "@/config/site";

import { ThemeToggle } from "./theme-toggle";
import { NavMenu } from "./nav-menu";
import TeamSwitcher from "./team-switcher";

import { TimeAdd } from "@/components/time-add";
import { UserAccountNav } from "@/components/user-account";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MobileNavMenu } from "./mobile-menu";

export function SiteHeader() {
  const pathname = usePathname();
  const { data: sessionData, status } = useSession();
  const { id: userId, email, name, workspaces: teamData, image } = sessionData?.user || {};

  posthog.identify(String(userId), { email, name });

  return (
    <header className="sticky top-0 z-50 mb-4 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center space-x-4">
        {/* Site Logo/Title */}
        <Link href="/" className="flex items-center space-x-2">
          <Clock className="h-6 w-6" />
          <span className="inline-block font-bold">{siteConfig.name}</span>
        </Link>
        {teamData && <TeamSwitcher teams={teamData} />}
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav>
            {/* Desktop Navigation */}
            <div className="hidden items-center space-x-3 md:flex">
              {pathname !== "/" && <NavMenu />}
              {pathname !== "/" && <TimeAdd />}
              <ThemeToggle />
              {status === "loading" && (
                <Loader className="rotate-0 scale-100 transition-all hover:text-zinc-950 dark:rotate-0 dark:scale-100 dark:text-zinc-400 dark:hover:text-zinc-100" />
              )}
              {status === "authenticated" && (
                <Button variant="outline" size="icon" className="rounded-full">
                  <UserAccountNav
                    user={{
                      name,
                      image,
                      email,
                    }}
                  />
                </Button>
              )}
            </div>
            {/* Mobile Menu */}
            {pathname !== "/" && (
              <div className="ml-auto flex space-x-2 md:hidden">
                <>
                  <TimeAdd />
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Menu size={24} />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full">
                      <div className="mt-8 flex items-center justify-between">
                        <ThemeToggle />
                        {status === "authenticated" && (
                          <Button variant="outline" size="icon" className="rounded-full">
                            <UserAccountNav
                              user={{
                                name,
                                image,
                                email,
                              }}
                            />
                          </Button>
                        )}
                      </div>
                      <MobileNavMenu />
                    </SheetContent>
                  </Sheet>
                </>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
