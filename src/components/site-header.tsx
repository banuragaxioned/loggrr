import Link from "next/link";

import { siteConfig } from "@/config/site";
import { Icons } from "@/components/icons";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { UserAccountNav } from "@/components/user-account";
import TeamSwitcher from "@/components/teamSwitcher";

export function SiteHeader() {
  const { data: sessionData } = useSession();
  const teamData = sessionData?.user.tenants;

  return (
    <header className="container sticky top-0 z-40 mx-auto flex h-16 w-full items-center space-x-4 border-b border-b-zinc-200 bg-white px-4 dark:border-b-zinc-700 dark:bg-zinc-950 sm:justify-between sm:space-x-0">
      <MainNav items={siteConfig.mainNav} />
      {teamData && <TeamSwitcher teams={teamData} />}
      <div className="flex flex-1 items-center justify-end space-x-4">
        <nav className="flex items-center space-x-1">
          <Link href={siteConfig.links.help} target="_blank" rel="noreferrer">
            <div
              className={buttonVariants({
                size: "sm",
                variant: "primary",
                className: "text-zinc-700 dark:text-zinc-400",
              })}
            >
              <Icons.help className="h-5 w-5" />
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
        </nav>
      </div>
    </header>
  );
}
