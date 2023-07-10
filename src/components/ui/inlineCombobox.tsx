"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Command, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { UseFormSetValue } from "react-hook-form";
import { cn } from "@/lib/utils";
import { AllProjects, AssignFormValues } from "@/types";


export function InlineCombobox({ options, setVal }: { options: AllProjects[], setVal: UseFormSetValue<AssignFormValues> }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<AllProjects>();
  const [inputValue, setInputValue] = React.useState("");

  const selectables = options.filter((option) => selected !== option);

  return (
    <Command className={cn("max-w-[230px] h-auto overflow-visible bg-transparent border rounded-md", open && ("ring-2 ring-offset-2 ring-ring"))}>
      {/* Avoid having the "Search" Icon */}
      <CommandInput
        ref={inputRef}
        value={inputValue}
        onValueChange={setInputValue}
        onBlur={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        placeholder="Select options..."
        className="rounded-0 ml-1 flex-1 bg-transparent outline-none placeholder:text-muted-foreground border-0 focus:ring-0 py-0"
      />
      <div className="relative">
        {open && selectables.length > 0 ? (
          <div className="absolute top-2 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {selectables.map((option) => {
                return (
                  <CommandItem
                    key={option.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={(value) => {
                      setInputValue(option.name);
                      setSelected(option);
                      setVal("projectId", option.id)
                      setOpen(false)
                    }}
                    className={"cursor-pointer py-1.5 pl-8 pr-2"}
                  >
                    {option.name}
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
