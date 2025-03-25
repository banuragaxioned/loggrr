"use client";

import * as React from "react";
import { ChevronDown, Clock } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@workspace/ui/components/sidebar";
import { getOrganizations, setActiveOrganization } from "@/lib/auth/organization";
import type { Organization } from "@workspace/db/schema";
import { Skeleton } from "@workspace/ui/components/skeleton";

export function OrganizationSwitcher() {
  const router = useRouter();
  const params = useParams();
  const [orgs, setOrgs] = React.useState<Organization[]>([]);
  const [activeOrg, setActiveOrg] = React.useState<Organization>();
  const [isLoading, setIsLoading] = React.useState(true);
  const currentSlug = params?.slug as string;

  React.useEffect(() => {
    async function init() {
      try {
        const organizations = await getOrganizations();
        if (!organizations?.length) {
          setIsLoading(false);
          return;
        }

        const validOrgs = organizations.filter(
          (org): org is Organization & { slug: string } => Boolean(org.slug) && typeof org.slug === "string",
        );

        if (!validOrgs.length) {
          setIsLoading(false);
          return;
        }

        setOrgs(validOrgs);
        const org = validOrgs.find((org) => org.slug === currentSlug) ?? validOrgs[0];
        if (!org) {
          setIsLoading(false);
          return;
        }

        setActiveOrg(org);

        if (!currentSlug || currentSlug !== org.slug) {
          await setActiveOrganization(org.slug);
          router.push(`/${org.slug}`);
        }
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [currentSlug, router]);

  const handleOrgChange = async (org: Organization) => {
    if (!org.slug || org.slug === activeOrg?.slug) return;
    setActiveOrg(org);
    await setActiveOrganization(org.slug);
    router.push(`/${org.slug}`);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="h-9 w-[180px] px-1.5">
              <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <Clock className="size-3" />
              </div>
              {isLoading || !activeOrg ? (
                <Skeleton className="h-4 w-[100px]" />
              ) : (
                <span className="truncate font-semibold">{activeOrg.name}</span>
              )}
              <ChevronDown className="opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[180px] rounded-lg" align="start" side="bottom" sideOffset={4}>
            <DropdownMenuLabel className="text-xs text-muted-foreground">Organizations</DropdownMenuLabel>
            {isLoading ? (
              <div className="p-2 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              orgs.map((org, index) => (
                <DropdownMenuItem key={org.id} onClick={() => handleOrgChange(org)} className="gap-2 p-2">
                  {org.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
