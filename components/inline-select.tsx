import React, { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check } from "lucide-react";

interface Options {
  id: number;
  name: string;
}

interface InlineSelectProps<TData, TValue> {
  label: string;
  title?: string;
  selectedValues: Options[];
  options: Options[];
  onSelect: (selectedOption: Options[]) => void;
}

export function InlineSelect<TData, TValue>({
  label,
  title,
  options,
  selectedValues,
  onSelect,
}: InlineSelectProps<TData, TValue>) {
  const [selected, setSelected] = useState<Options[]>(selectedValues);

  const handleSelect = (isSelected: boolean, option: Options) => {
    isSelected
      ? setSelected((prev) => prev.filter((opt) => option.id !== opt.id))
      : setSelected((prev) => [...prev, option]);
  };

  const isValueUpdated = useMemo(() => {
    if (selected.length !== selectedValues.length) return true;

    const selectedIds = new Set(selected.map((value) => value.id));
    const selectedValueIds = new Set(selectedValues.map((value) => value.id));
    return !(selectedIds.size === selectedValueIds.size && [...selectedIds].every((id) => selectedValueIds.has(id)));
  }, [selected, selectedValues]);

  return (
    <Popover onOpenChange={(e) => !e && setSelected(selectedValues)}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border">
          {selectedValues?.length > 0 ? (
            <>
              {selectedValues[0].name}
              {selectedValues?.length > 1 && (
                <>
                  <span className="mx-2 flex self-stretch items-center" aria-hidden="true">
                    <span className="bg-border h-4 w-px shrink-0" />
                  </span>
                  <div className="hidden space-x-1 lg:flex">
                    <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                      +{selectedValues.length - 1}
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
        <Command className="overflow-hidden">
          <CommandInput placeholder={`Search ${title}`} />
          <CommandList className="max-h-[250px]">
            <CommandEmpty>No {title} found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = (selected || []).find((values) => values.id === option.id);
                return (
                  <CommandItem key={option.id} onSelect={() => handleSelect(!!isSelected, option)}>
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        !!isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <Check className={cn("h-4 w-4")} />
                    </div>
                    <span>{option.name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
        {isValueUpdated && (
          <div className="border-t bg-popover p-1">
            <Button size="sm" className="h-8 w-full text-xs" onClick={() => onSelect(selected)}>
              Update
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
