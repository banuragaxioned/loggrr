import * as React from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/icons";

interface Options {
  id: number;
  label: string;
  value: string;
}

interface MultipleSelectProps<TData, TValue> {
  label: string
  title?: string;
  selectedValues: Options[];
  options: Options[];
  onSelect: (isSelected: boolean, selectedOption: Options) => void
}

export function MultipleSelect<TData, TValue>({
  label,
  title,
  options,
  selectedValues,
  onSelect
}: MultipleSelectProps<TData, TValue>) {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border">
          {selectedValues?.length > 0 ? (
            <>
              {selectedValues[0].label}
              {selectedValues?.length > 1 && (
                <>
                  <Separator orientation="vertical" className="mx-2 h-4" />
                  <div className="hidden space-x-1 lg:flex">
                    <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                      {selectedValues.length - 1} {title}
                    </Badge>
                  </div>
                </>
              )}
            </>
          ) : (
            label
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search ${title}`} />
          <CommandList>
            <CommandEmpty>No {title} found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.find((values) => values.id === option.id);
                return (
                  <CommandItem key={option.value} onSelect={() => onSelect(!!isSelected, option)}>
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        !!isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <Icons.check className={cn("h-4 w-4")} />
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
