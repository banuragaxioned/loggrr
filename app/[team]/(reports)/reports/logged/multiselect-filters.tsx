"use client";

import React from "react";
import { Check } from "lucide-react";
import { useQueryState } from "nuqs";

import { cn } from "@/lib/utils";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ClientAndUserInterface } from "./data-table";

interface DropdownInterface {
  title: string;
  searchable: boolean;
  icon?: React.ReactNode;
  options: ClientAndUserInterface[];
}

const MultiSelectFilter = ({ values }: { values: DropdownInterface }) => {
  const [open, setOpen] = React.useState(false);
  const [selectedParams, setSelectedParams] = useQueryState(values.title.toLowerCase(), {
    parse: (value) => (value ? value.split(",") : []),
    serialize: (value) => value.join(","),
  });

  const selectedOptions = selectedParams || [];

  const handleItemClick = (option: ClientAndUserInterface) => {
    const optionId = `${option.id}`;
    const updatedOptions = selectedOptions.includes(optionId)
      ? selectedOptions.filter((id) => id !== optionId)
      : [...selectedOptions, optionId];

    setSelectedParams(updatedOptions.length ? updatedOptions : null);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="w-min">
        <Button variant="outline" role="combobox" className="justify-between gap-1.5" size="sm">
          {values.icon}
          {values.title}
          {selectedOptions.length > 0 && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {selectedOptions.length}
              </Badge>
              <div className="hidden lg:flex">
                {selectedOptions.length > 1 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selectedOptions.length} selected
                  </Badge>
                ) : (
                  values.options
                    .filter((option) => selectedOptions.includes(`${option.id}`))
                    .map((option) => (
                      <Badge variant="secondary" key={option.id} className="rounded-sm px-1 font-normal">
                        {option.name}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          {values.searchable && <CommandInput placeholder="Search..." />}
          <CommandEmpty>No options found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {values.options.map((option) => {
                const isSelected = selectedOptions.includes(`${option.id}`);
                return (
                  <CommandItem key={option.id} className="p-0">
                    <div
                      onClick={() => handleItemClick(option)}
                      className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5"
                    >
                      <>
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible",
                          )}
                        >
                          <Check className={cn("h-4 w-4")} />
                        </div>
                        {option.name}
                      </>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandList>
          </CommandGroup>
          {selectedOptions.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setSelectedParams(null);
                    setOpen(false);
                  }}
                  className="cursor-pointer justify-center text-center"
                >
                  Clear filters
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelectFilter;
