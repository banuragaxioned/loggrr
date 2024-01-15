"use client";

import * as React from "react";
import { ThemeToggle } from "./theme-toggle";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Clock, Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { UserAccountNav } from "@/components/user-account";
import { NavMenu } from "./nav-menu";
import TeamSwitcher from "./team-switcher";
import { useParams, usePathname } from "next/navigation";
import posthog from "posthog-js";
import { TimeAdd } from "@/components/time-add";
import { MenuContext } from "./menu-context";
import { MobileNav } from "../components/nav-mobile";
import { X, Menu } from "lucide-react";
import { MainNavItem } from "../types";

export function SiteHeader() {
  const { data: sessionData, status } = useSession();
  const teamData = sessionData?.user.workspaces;
  const pathname = usePathname();

  const params = useParams();
  const slug = params?.team;

  const { toggle, toggleFunction } = React.useContext(MenuContext)
  
  const mobileLinks: MainNavItem[] = [
    {
      href: `/${slug}/projects`,
      title: "Projects",
    },
    {
      href: `/${slug}/clients`,
      title: "Clients",
    },
    {
      href: `/${slug}/members`,
      title: "Members",
    },
    {
      href: `/${slug}/skills/summary`,
      title: "Skills",
    },
    {
      href: `/${slug}/skills/report`,
      title: "Report",
    },
  ]

  posthog.identify(String(sessionData?.user.id), { email: sessionData?.user.email, name: sessionData?.user.name });

  return (
    <header className="sticky top-0 z-50 mb-4 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center space-x-4">
        <Link href="/" className="items-center space-x-2 flex">
          <Clock className="h-6 w-6" />
          <span className="font-bold sm:inline-block">{siteConfig.name}</span>
        </Link>
        {teamData && <TeamSwitcher teams={teamData} />}
        <div className="flex flex-1 items-center justify-end space-x-2 md:justify-end">
          <nav className="flex items-center space-x-3">
            {pathname !== "/" && <NavMenu />}
            {pathname !== "/" && <TimeAdd />}
            <ThemeToggle className="hidden md:flex" />
            {status === "loading" && (
              <Loader className="rotate-0 scale-100 transition-all hover:text-zinc-950 dark:rotate-0 dark:scale-100 dark:text-zinc-400 dark:hover:text-zinc-100" />
            )}
            {status === "authenticated" && (
              <UserAccountNav
                user={{
                  name: sessionData.user.name,
                  image: sessionData.user.image,
                  email: sessionData.user.email,
                }}
              />
            )}
          </nav>
          <button className="flex items-center space-x-2 md:hidden" onClick={() => toggleFunction(!toggle)}>
            {toggle ? <X/> : <Menu/>}
          </button>
          {toggle && ( <MobileNav toggleFunction={toggleFunction} toggle={toggle} items={mobileLinks}/>)}
        </div>
      </div>
    </header>
  );
}
