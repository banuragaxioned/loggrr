"use client";

import { ThemeToggle } from "./theme-toggle";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Clock } from "lucide-react";
import { useSession } from "next-auth/react";
import { UserAccountNav } from "@/components/user-account";
import { NavMenu } from "./nav-menu";
import TeamSwitcher from "./team-switcher";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const { data: sessionData } = useSession();
  const teamData = sessionData?.user.tenants;
  const pathname = usePathname();

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
          </nav>
        </div>
      </div>
    </header>
  );
}
