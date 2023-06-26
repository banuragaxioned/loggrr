"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Dialog } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Icons } from "@/components/icons";
import { Role } from "@prisma/client";
import { redirect, useRouter, useParams } from "next/navigation";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface TeamSwitcherProps extends PopoverTriggerProps {}

interface Team {
  id: number;
  name: string;
  slug: string;
  role: Role;
}

interface Teams extends React.HTMLAttributes<HTMLDivElement> {
  teams: Team[];
}

export default function TeamSwitcher(teamData: Teams, { className }: TeamSwitcherProps) {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState<Team>(teamData.teams[0]);
  if (selectedTeam.slug !== params?.team) {
    router.push(`/launchpad/${selectedTeam.slug}`);
  }

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-[200px] justify-between", className)}
          >
            <Icons.team className="mr-2 h-5 w-5" />
            {selectedTeam.name}
            <Icons.select className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              {teamData.teams.map((item) => (
                <CommandItem
                  key={item.slug}
                  onSelect={() => {
                    setSelectedTeam(item);
                    setOpen(false);
                  }}
                  onChange={() => {
                    redirect(`/teams/${item.slug}`);
                  }}
                  className="text-sm"
                >
                  <Icons.team className="mr-2 h-5 w-5" />
                  {item.name}
                  <Icons.check
                    className={cn("ml-auto h-4 w-4", selectedTeam.slug === item.slug ? "opacity-100" : "opacity-0")}
                  />
                </CommandItem>
              ))}
            </CommandList>
            <CommandSeparator />
          </Command>
        </PopoverContent>
      </Popover>
    </Dialog>
  );
}
