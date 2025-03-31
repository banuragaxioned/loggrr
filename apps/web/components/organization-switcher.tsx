"use client";

import * as React from "react";
import { ChevronDown, Clock } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@workspace/ui/components/sidebar";
import type { Organization } from "@workspace/db/schema";
import { Skeleton } from "@workspace/ui/components/skeleton";

type OrganizationWithSlug = Pick<Organization, "id" | "name" | "slug">;

export function OrganizationSwitcher() {
  const router = useRouter();
  const params = useParams();
  const trpc = useTRPC();

  const [activeOrg, setActiveOrg] = React.useState<OrganizationWithSlug>();
  const currentSlug = params.slug as Organization["slug"];

  const setActiveOrgMutation = useMutation(trpc.organization.set.mutationOptions());
  const { data: organizations, isLoading } = useQuery(trpc.organization.getAll.queryOptions());

  // Set active org based on current slug or first org
  React.useEffect(() => {
    if (!organizations?.length) return;

    const org = organizations.find((org) => org.slug === currentSlug) ?? organizations[0];
    if (!org?.slug) return;

    setActiveOrg(org);
    setActiveOrgMutation.mutate({ slug: org.slug });
  }, [organizations, currentSlug]);

  const handleOrgChange = async (org: OrganizationWithSlug) => {
    if (!org.slug || org.slug === activeOrg?.slug) return;
    setActiveOrgMutation.mutate({ slug: org.slug });
    setActiveOrg(org);
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
              organizations
                ?.filter((org) => org.slug)
                .map((org, index) => (
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
