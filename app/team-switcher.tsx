"use client";

import * as React from "react";
import { Boxes, Check, ChevronRight, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

import { Role } from "@prisma/client";
import { cn } from "@/lib/utils";

import { Button, buttonVariants } from "@/components/ui/button";
import { Command, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface TeamSwitcherProps extends PopoverTriggerProps {}

interface Team {
  id: number;
  name: string;
  slug: string;
  role: Role;
}

interface Teams {
  teams: Team[];
}

export default function TeamSwitcher(teamData: Teams, { className }: TeamSwitcherProps) {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState<Team>();

  React.useEffect(() => {
    if (teamData.teams.length === 1) {
      setSelectedTeam(teamData.teams[0]);
    }
  }, [teamData]);

  if (params?.team && selectedTeam?.slug !== params.team) {
    const team = teamData.teams.find((item) => item.slug === params.team);
    if (team) {
      setSelectedTeam(team);
    }
  }

  if (teamData.teams.length === 1 && !params.team) {
    return (
      <Link
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex gap-2")}
        href={`/${teamData.teams[0].slug}`}
      >
        Dashboard
        <ChevronRight size={16} />
      </Link>
    );
  }

  if (teamData.teams.length <= 1) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a team"
          className={cn("min-w-44 justify-between", className)}
        >
          {selectedTeam?.name && <Boxes className="mr-2 h-5 w-5 shrink-0" />}
          {selectedTeam?.name ?? "Select Workspace"}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0" align="start">
        <Command>
          <CommandList>
            {teamData.teams.map((item) => (
              <CommandItem
                key={item.slug}
                onSelect={() => {
                  setOpen(false);
                }}
                className="p-0"
              >
                <Link href={`/${item.slug}`} className="flex w-full items-center justify-between px-2 py-1.5">
                  <Boxes className="mr-2 h-5 w-5" />
                  {item.name}
                  <Check
                    className={cn("ml-auto h-4 w-4", selectedTeam?.slug === item.slug ? "opacity-100" : "opacity-0")}
                  />
                </Link>
              </CommandItem>
            ))}
          </CommandList>
          <CommandSeparator />
        </Command>
      </PopoverContent>
    </Popover>
  );
}
