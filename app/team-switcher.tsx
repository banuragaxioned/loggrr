"use client";

import * as React from "react";
import { Boxes, Check, ChevronRight, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Role } from "@/generated/prisma/browser";
import { cn } from "@/lib/utils";

import { Button, buttonVariants } from "@/components/ui/button";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
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

export default function TeamSwitcher({ teams, className }: Teams & TeamSwitcherProps) {
  const params = useParams();
  const [open, setOpen] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState<Team>();
  const switcherTeams = React.useMemo(() => teams, [teams]);

  React.useEffect(() => {
    if (switcherTeams.length === 1) {
      setSelectedTeam(switcherTeams[0]);
    }
  }, [switcherTeams]);

  if (params?.team && selectedTeam?.slug !== params.team) {
    const team = switcherTeams.find((item) => item.slug === params.team);
    if (team) {
      setSelectedTeam(team);
    }
  }

  if (switcherTeams.length === 1 && !params.team) {
    return (
      <Link
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex gap-2")}
        href={`/${switcherTeams[0].slug}`}
      >
        Dashboard
        <ChevronRight size={16} />
      </Link>
    );
  }

  if (switcherTeams.length <= 1) {
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
          {selectedTeam?.name && <Boxes className="mr-2 size-4 shrink-0" />}
          <span className="truncate">{selectedTeam?.name ?? "Select Workspace"}</span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start" sideOffset={4}>
        <Command>
          <CommandList>
            {switcherTeams.map((item) => (
              <CommandItem key={item.slug} value={item.name} onSelect={() => setOpen(false)} className="p-0">
                <Link href={`/${item.slug}`} className="flex w-full min-w-0 items-center gap-2 px-2 py-1.5">
                  <Boxes className="size-4 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{item.name}</span>
                  <Check
                    className={cn("size-4 shrink-0", selectedTeam?.slug === item.slug ? "opacity-100" : "opacity-0")}
                  />
                </Link>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
