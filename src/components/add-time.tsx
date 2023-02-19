"use client";

import { Calculator, Calendar, Smile } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Button } from "./ui/button";
import { CommandCombobox } from "./select-combo";

export function AddTime() {
  return (
    <Command className="rounded-lg border border-slate-100  shadow-md dark:border-slate-800">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Allocations">
          <CommandItem>
            <span>Acme Inc. / Project X / Design</span>
            <CommandShortcut>2 h</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Space X / Project Y / Engineering</span>
            <CommandShortcut>30 m</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Tesla Inc. / Model S / Crash test</span>
            <CommandShortcut>45 m</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Recently used">
          <CommandItem>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <Smile className="mr-2 h-4 w-4" />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem>
            <Calculator className="mr-2 h-4 w-4" />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
      <div className="flex justify-between p-2">
        <div className="space-x-2">
          <CommandCombobox />
          <CommandCombobox />
        </div>
        <Button>Clear</Button>
      </div>
    </Command>
  );
}
