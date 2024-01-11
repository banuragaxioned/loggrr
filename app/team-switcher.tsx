"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Boxes, Check, ChevronsUpDown } from "lucide-react";
import { Role } from "@prisma/client";
import { useRouter, useParams } from "next/navigation";

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
  const [selectedTeam, setSelectedTeam] = React.useState<Team>(teamData.teams[0]);

  if (params?.team && selectedTeam.slug !== params.team) {
    const team = teamData.teams.find((item) => item.slug === params.team);
    if (team) {
      setSelectedTeam(team);
    }
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
          className={cn("w-52 justify-between", className)}
        >
          <Boxes className="mr-2 h-5 w-5" />
          {selectedTeam.name}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0">
        <Command>
          <CommandList>
            {teamData.teams.map((item) => (
              <CommandItem
                key={item.slug}
                onSelect={() => {
                  setSelectedTeam(item);
                  router.push(`/${item.slug}`);
                  setOpen(false);
                }}
                className="text-sm"
              >
                <Boxes className="mr-2 h-5 w-5" />
                {item.name}
                <Check
                  className={cn("ml-auto h-4 w-4", selectedTeam.slug === item.slug ? "opacity-100" : "opacity-0")}
                />
              </CommandItem>
            ))}
          </CommandList>
          <CommandSeparator />
        </Command>
      </PopoverContent>
    </Popover>
  );
}
