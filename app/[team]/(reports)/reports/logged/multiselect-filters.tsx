"use client";

import React, { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";

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

const MultiSelectFilter = ({ values }: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedClients = searchParams.get("selectedclients");
  const [open, setOpen] = useState(false);
  // const isFilterOf = values.title.toLowerCase();
  const [selectedOptions, setSelectedOptions] = useState<any>(
    selectedClients ? (selectedClients.split(",") as string[]) : [],
  );

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const handleItemClick = (option: any) => {
    const optionId = `${option.id}`;

    let updatedOptions;
    // Check if the optionId is already in selectedOptions
    if (selectedOptions.includes(optionId)) {
      // Remove the optionId from selectedOptions
      updatedOptions = selectedOptions.filter((id: any) => id !== optionId);
      setSelectedOptions(updatedOptions);
    } else {
      // Add the optionId to selectedOptions
      updatedOptions = [...selectedOptions, optionId];
      setSelectedOptions(updatedOptions);
    }

    // Update the URL with the new selectedOptions
    const query = updatedOptions.join(",");
    router.push(pathname + "?" + createQueryString("selectedclients", query));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        className={cn(
          "w-min",
          selectedOptions.length > 0 &&
            "bg-indigo-100 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-500 dark:bg-indigo-600/20 dark:text-white dark:hover:bg-indigo-500/20",
        )}
      >
        <Button variant="outline" role="combobox" className="justify-between">
          {selectedOptions.length > 0
            ? values.options.find((item: any) => item.id === +selectedOptions[0])?.name
            : values.title}
          {selectedOptions.length > 1 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                +{selectedOptions.length - 1} selected
              </Badge>
            </>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          {values.searchable && <CommandInput placeholder="Search..." />}
          <CommandEmpty>No options found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {values.options.map((option: any) => {
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
                    setSelectedOptions([]);
                    setOpen(false);
                    router.push(pathname + "?" + createQueryString("selectedclients", ""));
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
