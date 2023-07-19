"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Command, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { UseFormSetValue } from "react-hook-form";
import { cn } from "@/lib/utils";
import { ComboboxOptions, AssignFormValues } from "@/types";

type InlineComboboxProps = {
  options: ComboboxOptions[];
  setVal: UseFormSetValue<AssignFormValues>;
  fieldName: "projectId" | "userId";
  icon: React.ReactNode;
  label: string
};

export function InlineCombobox({ options, setVal, fieldName, icon, label }: InlineComboboxProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<ComboboxOptions>();
  const [inputValue, setInputValue] = React.useState("");

  const selectables = options.filter((option) => selected !== option);

  return (
    <Command
      className={cn(
        "mt-2 h-auto w-full overflow-visible rounded-md border bg-transparent",
        open && "ring-2 ring-ring ring-offset-0"
      )}
    >
      {/* Avoid having the "Search" Icon */}
      <div className="flex items-center px-3" cmdk-input-wrapper="">
        {icon}
        <CommandInput
          ref={inputRef}
          value={inputValue}
          onValueChange={setInputValue}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          placeholder={`Select ${label}...`}
          className="rounded-0 flex-1 border-0 bg-transparent pl-1 outline-none placeholder:text-muted-foreground focus:ring-0"
        />
      </div>

      <div className="relative">
        {open && selectables.length > 0 ? (
          <div className="absolute top-2 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {selectables.map((option) => {
                return (
                  option.name && (
                    <CommandItem
                      key={option.id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        if (option.name) setInputValue(option.name);
                        setSelected(option);
                        setVal(fieldName, option.id);
                        setOpen(false);
                      }}
                      className={"cursor-pointer py-1.5 pl-8 pr-2"}
                    >
                      {option.name}
                    </CommandItem>
                  )
                );
              })}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  );
}
