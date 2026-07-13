"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import posthog from "posthog-js";
import { ChevronRight, Loader } from "lucide-react";

import { excludedNavRoutes, siteConfig } from "@/config/site";
import { getUserRole } from "@/lib/helper";
import { Project } from "@/types";

import { AppSidebar } from "@/components/app-sidebar";
import { TimeAdd } from "@/components/time-add";
import { UserAccountNav } from "@/components/user-account";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { SidebarInset, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import TeamSwitcher from "@/app/team-switcher";

function MobileSidebarTab() {
  const { toggleSidebar, openMobile, isMobile } = useSidebar();

  if (!isMobile || openMobile) return null;

  return (
    <button
      type="button"
      aria-label="Open sidebar"
      onClick={toggleSidebar}
      className="bg-background text-muted-foreground fixed top-2.5 left-0 z-40 flex size-6 items-center justify-center rounded-full border shadow-sm md:hidden print:hidden"
    >
      <ChevronRight className="size-3.5" />
    </button>
  );
}

export function AppShell({
  children,
  projects,
  defaultSidebarOpen = true,
}: {
  children: React.ReactNode;
  projects?: Project[];
  defaultSidebarOpen?: boolean;
}) {
  const params = useParams();
  const pathname = usePathname();
  const slug = params.team && decodeURIComponent(params.team as string);
  const { data: sessionData, status } = useSession();
  const { id: userId, email, name, workspaces: teamData, image } = sessionData?.user || {};
  const filteredProjects = projects?.filter((project) => project.workspace === slug);
  const workspaceRole = getUserRole(teamData, slug);

  if (userId) posthog.identify(String(userId), { email, name });

  const isNavVisible = !excludedNavRoutes.includes(pathname);
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const isAuthPage = pathname.includes("/auth/");
  const showSidebar = isNavVisible && (isAuthenticated || isLoading);

  if (!showSidebar) {
    return (
      <>
        <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 mb-4 w-full border-b backdrop-blur-sm print:hidden">
          <div className="container flex h-14 items-center space-x-4">
            <Link href={slug ? `/${slug}` : "/"} aria-label={siteConfig.name}>
              <Logo />
            </Link>
            <div className="flex flex-1 items-center justify-end space-x-2">
              {isAuthenticated && (
                <nav>
                  <div className="flex items-center space-x-3">
                    {teamData && <TeamSwitcher teams={teamData} />}
                    <UserAccountNav user={{ name, image, email }} />
                  </div>
                </nav>
              )}
              {isLoading && <Loader className="mr-1" />}
            </div>
            {!isAuthenticated && !isLoading && !isAuthPage && (
              <Button variant="default" size="sm" onClick={() => signIn()}>
                Sign in
              </Button>
            )}
          </div>
        </header>
        {children}
      </>
    );
  }

  return (
    <SidebarProvider defaultOpen={defaultSidebarOpen}>
      <AppSidebar role={workspaceRole} user={{ name, image, email }} teams={teamData} isLoading={isLoading} />
      <SidebarInset>
        <MobileSidebarTab />
        <div className="flex flex-1 flex-col pt-4 md:pt-6">{children}</div>

        {filteredProjects && (
          <div className="fixed right-4 bottom-4 z-40 md:hidden print:hidden">
            <div className="[&_button]:size-14 [&_button]:rounded-full [&_button]:shadow-lg">
              <TimeAdd projects={filteredProjects} />
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
