"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Dialog } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Icons } from "@/components/icons";
import { Tenant } from "@prisma/client";

const teams = [
  {
    id: 1,
    name: "Axioned",
    slug: "axioned",
  },
  {
    id: 2,
    name: "Loggr",
    slug: "loggr",
  },
];

type Team = (typeof teams)[number];

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface TeamSwitcherProps extends PopoverTriggerProps {}

interface TeamSwitchertNavProps extends React.HTMLAttributes<HTMLDivElement> {
  team: Pick<Tenant, "id" | "name" | "slug">;
}

type Teams = {
  id: number;
  name: string;
  slug: string;
}[];

export default function TeamSwitcher(team: Teams, { className }: TeamSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState<Team>(teams[0]);
  console.log(team);

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
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              {teams.map((list) => (
                <CommandItem
                  key={list.slug}
                  onSelect={() => {
                    setSelectedTeam(list);
                    setOpen(false);
                  }}
                  className="text-sm"
                >
                  <Icons.team className="mr-2 h-5 w-5" />
                  {list.name}
                  <Check
                    className={cn("ml-auto h-4 w-4", selectedTeam.slug === list.slug ? "opacity-100" : "opacity-0")}
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
