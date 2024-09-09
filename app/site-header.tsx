"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import posthog from "posthog-js";
import { Clock, Loader } from "lucide-react";

import { excludedNavRoutes, siteConfig } from "@/config/site";

import { NavMenu } from "./nav-menu";
import TeamSwitcher from "./team-switcher";

import { TimeAdd } from "@/components/time-add";
import { UserAccountNav } from "@/components/user-account";
import { MobileNavMenu } from "./mobile-menu";
import { cn } from "@/lib/utils";
import { CommandMenu } from "@/components/command-action";
import { Button } from "@/components/ui/button";
import { Project } from "@/types";

export function SiteHeader({ projects }: { projects?: Project[] }) {
  const params = useParams();
  const pathname = usePathname();
  const slug = params.team && decodeURIComponent(params.team as string);
  const { data: sessionData, status } = useSession();
  const { id: userId, email, name, workspaces: teamData, image } = sessionData?.user || {};
  const filteredProjects = projects?.filter((project) => project.workspace === slug);
  const workspaceRole = teamData?.find((team) => team.slug === slug)?.role ?? "GUEST";

  posthog.identify(String(userId), { email, name });

  const isNavVisible = !excludedNavRoutes.includes(pathname);

  return (
    <header className="sticky top-0 z-50 mb-4 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 print:hidden">
      <div className="container flex h-14 items-center space-x-4">
        {/* Site Logo/Title */}
        <Link href={slug ? `/${slug}` : "/"} className="flex items-center space-x-2">
          <Clock />
          <span className="inline-block font-bold">{siteConfig.name}</span>
        </Link>
        {isNavVisible && <CommandMenu teams={teamData!} slug={slug} />}
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav>
            {/* Desktop Navigation */}
            <div className={cn("hidden items-center space-x-3 md:flex", !isNavVisible && "flex")}>
              {isNavVisible && <NavMenu role={workspaceRole} />}
              {teamData && <TeamSwitcher teams={teamData} />}
              {status === "loading" && <Loader className="mr-1" />}
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
                  {filteredProjects && <TimeAdd projects={filteredProjects} />}
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
