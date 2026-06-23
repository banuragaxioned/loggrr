"use client";

import React, { useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

export interface ProjectSelectOption {
  id: number;
  name: string;
  archived?: boolean;
}

interface ProjectEditComboBoxProps {
  icon?: React.ReactElement;
  options: ProjectSelectOption[];
  label: string;
  selectedItem: ProjectSelectOption | null;
  handleSelect: (id: string) => void;
  className?: string;
}

function ArchivedLabel({ compact = false }: { compact?: boolean }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "shrink-0 rounded-full border-amber-300/80 bg-amber-50 font-medium text-amber-800 hover:bg-amber-50",
        "dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-950/40",
        compact ? "h-5 px-1 py-0 text-[8px] uppercase tracking-wide" : "px-1 py-0.5 text-[11px]",
      )}
    >
      Archived
    </Badge>
  );
}

function OptionLabel({ option }: { option: ProjectSelectOption }) {
  return (
    <span className="flex min-w-0 flex-1 items-center gap-2">
      <span className={cn("min-w-0 truncate", option.archived && "text-muted-foreground")}>{option.name}</span>
      {option.archived && <ArchivedLabel compact />}
    </span>
  );
}

export function ProjectEditComboBox({
  icon,
  options,
  label,
  selectedItem,
  handleSelect,
  className,
}: ProjectEditComboBoxProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const filteredOptions = inputValue
    ? options.filter((option) => option.name.toLowerCase().includes(inputValue.toLowerCase()))
    : options;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setInputValue("");
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" size="sm" className="flex w-full justify-between">
          {icon}
          <span className="flex min-w-0 flex-1 items-center gap-2">
            <span
              className={cn(
                "inline-block min-w-0 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap",
                selectedItem?.archived && "text-muted-foreground",
              )}
            >
              {selectedItem?.name || label}
            </span>
            {selectedItem?.archived && <ArchivedLabel compact />}
          </span>
          <ChevronDown className="ml-auto h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        className={cn("max-w-[256px] border-0 bg-popover p-0 text-popover-foreground", className)}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <Command className="box-border rounded-t-[5px] border border-border">
          <div className="flex w-full items-center rounded-t-[5px] border-b border-border">
            <Search size={16} className="ml-[10px] text-gray-400" />
            <input
              className="m-1 box-border h-9 w-full rounded-none border-0 bg-popover pl-1.5 pr-2.5 text-sm focus:outline-hidden"
              autoFocus
              placeholder="Search here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          {filteredOptions.length > 0 ? (
            <CommandList className="max-h-[260px] w-full px-[5px] py-2">
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.id}
                  value={`${option.id}`}
                  onSelect={() => {
                    handleSelect(option.id.toString());
                    setOpen(false);
                    setInputValue("");
                  }}
                  className="w-full cursor-pointer justify-between gap-2"
                >
                  <OptionLabel option={option} />
                  {selectedItem?.id === option.id && <Check size={16} className="shrink-0" />}
                </CommandItem>
              ))}
            </CommandList>
          ) : (
            <CommandEmpty className="w-full p-3 text-xs">No options found!</CommandEmpty>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
