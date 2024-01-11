"use client";

import { ThemeToggle } from "./theme-toggle";
import Link from "next/link";
import { siteConfig } from "config/site";
import { Clock, Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { UserAccountNav } from "components/user-account";
import { NavMenu } from "./nav-menu";
import TeamSwitcher from "./team-switcher";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { TimeAdd } from "components/time-add";

export function SiteHeader() {
  const { data: sessionData, status } = useSession();
  const teamData = sessionData?.user.workspaces;
  const pathname = usePathname();

  posthog.identify(String(sessionData?.user.id), { email: sessionData?.user.email, name: sessionData?.user.name });

  return (
    <header className="sticky top-0 z-50 mb-4 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center space-x-4">
        <Link href="/" className="hidden items-center space-x-2 md:flex">
          <Clock className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">{siteConfig.name}</span>
        </Link>
        {teamData && <TeamSwitcher teams={teamData} />}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-3">
            {pathname !== "/" && <NavMenu />}
            {pathname !== "/" && <TimeAdd />}
            <ThemeToggle />
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
        </div>
      </div>
    </header>
  );
}
