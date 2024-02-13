"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import posthog from "posthog-js";
import { Clock, Loader } from "lucide-react";

import { excludedNavRoutes, siteConfig } from "@/config/site";

import { ThemeToggle } from "./theme-toggle";
import { NavMenu } from "./nav-menu";
import TeamSwitcher from "./team-switcher";

import { TimeAdd } from "@/components/time-add";
import { UserAccountNav } from "@/components/user-account";
import { MobileNavMenu } from "./mobile-menu";
import { cn } from "@/lib/utils";
import { CommandMenu } from "@/components/command-action";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const params = useParams();
  const pathname = usePathname();
  const slug = params.team && decodeURIComponent(params.team as string);
  const { data: sessionData, status } = useSession();
  const { id: userId, email, name, workspaces: teamData, image } = sessionData?.user || {};

  posthog.identify(String(userId), { email, name });

  const isNavVisible = !excludedNavRoutes.includes(pathname);

  return (
    <header className="sticky top-0 z-50 mb-4 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center space-x-4">
        {/* Site Logo/Title */}
        <Link href={slug ? `/${slug}` : "/"} className="flex items-center space-x-2">
          <Clock className="h-6 w-6" />
          <span className="inline-block font-bold">{siteConfig.name}</span>
        </Link>
        {isNavVisible && <CommandMenu teams={teamData!} slug={slug} />}
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav>
            {/* Desktop Navigation */}
            <div className={cn("hidden items-center space-x-3 md:flex", !isNavVisible && "flex")}>
              {isNavVisible && <NavMenu />}
              {isNavVisible && <TimeAdd />}
              <ThemeToggle />
              {status === "loading" && (
                <Loader className="rotate-0 scale-100 transition-all hover:text-zinc-950 dark:rotate-0 dark:scale-100 dark:text-zinc-400 dark:hover:text-zinc-100" />
              )}
              {teamData && <TeamSwitcher teams={teamData} />}
              {status === "authenticated" && (
                <UserAccountNav
                  user={{
                    name,
                    image,
                    email,
                  }}
                />
              )}
            </div>
            {/* Mobile Menu */}
            {isNavVisible && (
              <div className="ml-auto flex space-x-2 md:hidden">
                <>
                  <TimeAdd />
                  {teamData && <TeamSwitcher teams={teamData} />}
                  <MobileNavMenu userProps={{ status, name, image, email }} />
                </>
              </div>
            )}
          </nav>
        </div>
        {status !== "loading" && status !== "authenticated" && (
          <Button variant="default" size="sm" onClick={() => signIn()}>
            Sign in
          </Button>
        )}
      </div>
    </header>
  );
}
