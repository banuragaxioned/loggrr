"use client";

import { ThemeToggle } from "./theme-toggle";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Clock, HelpCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { UserAccountNav } from "@/components/user-account";
import { NavMenu } from "./nav-menu";
import TeamSwitcher from "./team-switcher";

export function SiteHeader() {
  const { data: sessionData } = useSession();

  return (
    <header className="sticky top-0 z-50 mb-4 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="hidden items-center space-x-2 md:flex">
          <Clock className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">{siteConfig.name}</span>
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-1">
            <NavMenu />
            <Link href={siteConfig.links.help} target="_blank" rel="noreferrer">
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "primary",
                  className: "text-zinc-700 dark:text-zinc-400",
                })}
              >
                <HelpCircle className="h-5 w-5" />
                <span className="sr-only">Help</span>
              </div>
            </Link>
            <ThemeToggle />
            {sessionData && (
              <UserAccountNav
                user={{
                  name: sessionData.user.name,
                  image: sessionData.user.image,
                  email: sessionData.user.email,
                }}
              />
            )}
            {/* {teamData && <TeamSwitcher teams={teamData} />} */}
          </nav>
        </div>
      </div>
    </header>
  );
}
