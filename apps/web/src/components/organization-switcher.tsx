"use client";

import { BriefcaseBusiness, ChevronDown, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { redirect, useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";
import { SKIPPED_PATHS } from "@/constants";

export function OrganizationSwitcher() {
  const { organization } = useParams<{ organization: string }>();
  const router = useRouter();

  const { data: organizations, isPending: isOrganizationsPending } = authClient.useListOrganizations();
  const { data: activeOrganization, isPending: isActiveTeamPending } = authClient.useActiveOrganization();

  useEffect(() => {
    if (
      !SKIPPED_PATHS.includes(organization) &&
      organization !== activeOrganization?.slug &&
      !isActiveTeamPending &&
      !isOrganizationsPending
    ) {
      authClient.organization.setActive({
        organizationSlug: organization,
        fetchOptions: {
          onError: () => {
            toast.error("You are not authorized to access this page");
            redirect("/dashboard");
          },
        },
      });
    }
  }, [organization, activeOrganization?.slug, isActiveTeamPending, isOrganizationsPending]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-fit px-1.5 space-x-2">
              <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={activeOrganization?.logo ?? ""} />
                  <AvatarFallback className="rounded-lg">{activeOrganization?.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{activeOrganization?.name ?? "No active organization"}</span>
              </div>
              <ChevronDown className="opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 rounded-lg" align="start" side="bottom" sideOffset={4}>
            <DropdownMenuLabel className="text-xs text-muted-foreground">Organizations</DropdownMenuLabel>
            {organizations?.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => {
                  authClient.organization.setActive({ organizationId: team.id });
                  router.push(`/${team.slug}`);
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <BriefcaseBusiness className="size-4 shrink-0" />
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" disabled>
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
