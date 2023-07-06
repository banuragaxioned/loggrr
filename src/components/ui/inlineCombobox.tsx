"use client";

import * as React from "react";
import { X } from "lucide-react";

// import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";

type Framework = Record<"value" | "label", string>;

export function FancyMultiSelect({ FRAMEWORKS }: { FRAMEWORKS: Framework[] }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Framework>();
  const [inputValue, setInputValue] = React.useState("");

  const selectables = FRAMEWORKS.filter((framework) => selected !== framework);

  return (
    <Command className={cn("max-w-[230px] overflow-visible bg-transparent border rounded-md", open && ("ring-2 ring-offset-2 ring-ring"))}>
      {/* Avoid having the "Search" Icon */}
      <CommandInput
        ref={inputRef}
        value={inputValue}
        onValueChange={setInputValue}
        onBlur={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        placeholder="Select frameworks..."
        className="rounded-0 ml-1 flex-1 bg-transparent outline-none placeholder:text-muted-foreground border-0 focus:ring-0 py-0"
      />

      <div className="relative">
        {open && selectables.length > 0 ? (
          <div className="absolute top-2 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {selectables.map((framework) => {
                return (
                  <CommandItem
                    key={framework.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={(value) => {
                      setInputValue(framework.label);
                      setSelected(framework);
                    }}
                    className={"cursor-pointer py-1.5 pl-8 pr-2"}
                  >
                    {framework.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  );
}
