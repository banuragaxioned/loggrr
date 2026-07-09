"use client";

import React, { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClientAndUserInterface } from "./data-table";

interface DropdownInterface {
  title: string;
  searchable: boolean;
  icon?: React.ReactNode;
  options: ClientAndUserInterface[];
  archivedLabel?: string;
}

const MultiSelectFilter = ({ values }: { values: DropdownInterface }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFilterOf = values.title.toLowerCase();
  const selectedClients = searchParams.get(isFilterOf);
  const [open, setOpen] = useState(false);
  const selectedOptions = selectedClients ? (selectedClients.split(",") as string[]) : [];

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(name, value);
      else params.delete(name);

      return params.toString();
    },
    [searchParams],
  );

  const handleItemClick = (option: ClientAndUserInterface) => {
    const optionId = `${option.id}`;

    let updatedOptions;
    // Check if the optionId is already in selectedOptions
    if (selectedOptions.includes(optionId)) {
      // Remove the optionId from selectedOptions
      updatedOptions = selectedOptions.filter((id: string) => id !== optionId);
    } else {
      // Add the optionId to selectedOptions
      updatedOptions = [...selectedOptions, optionId];
    }
    const query = updatedOptions.join(",");
    router.push(pathname + "?" + createQueryString(isFilterOf, query));
  };

  // Group options into active / archived (active first) when any option carries
  // an `archived` flag (Category + Task filters); otherwise render flat (Members).
  const hasArchived = values.options.some((option) => option.archived);
  const activeOptions = hasArchived ? values.options.filter((option) => !option.archived) : values.options;
  const archivedOptions = hasArchived ? values.options.filter((option) => option.archived) : [];

  const renderItem = (option: ClientAndUserInterface) => {
    const isSelected = selectedOptions.includes(`${option.id}`);
    return (
      <CommandItem key={option.id} className="p-0">
        <div
          onClick={() => handleItemClick(option)}
          className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5"
        >
          <div
            className={cn(
              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
              isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible",
            )}
          >
            <Check className="h-4 w-4" />
          </div>
          {option.name}
        </div>
      </CommandItem>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="w-min">
        <Button variant="outline" role="combobox" className="justify-between gap-1.5" size="sm">
          {values.icon}
          {values.title}
          {selectedOptions.length > 0 && (
            <>
              <span className="flex self-stretch items-center" aria-hidden="true">
                <span className="bg-border h-4 w-px shrink-0" />
              </span>
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
        <Command className="overflow-hidden">
          {values.searchable && <CommandInput placeholder="Search..." />}
          <CommandList className="max-h-[250px]">
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup heading={hasArchived ? "Active" : undefined}>{activeOptions.map(renderItem)}</CommandGroup>
            {archivedOptions.length > 0 && (
              <CommandGroup heading={values.archivedLabel ?? "Archived"}>{archivedOptions.map(renderItem)}</CommandGroup>
            )}
          </CommandList>
        </Command>
        {selectedOptions.length > 0 && (
          <div className="border-t bg-popover p-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-full text-xs"
              onClick={() => {
                setOpen(false);
                const query = createQueryString(isFilterOf, "");
                router.push(query ? `${pathname}?${query}` : pathname);
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelectFilter;
