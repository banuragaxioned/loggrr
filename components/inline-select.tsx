import React, { useEffect, useState } from "react";

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
  CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
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
  const [isValueUpdated, setValueUpdated] = useState(false);

  const handleSelect = (isSelected: boolean, option: Options) => {
    isSelected
      ? setSelected((prev) => prev.filter((opt) => option.id !== opt.id))
      : setSelected((prev) => [...prev, option]);
  };

  useEffect(() => {
    let valueUpdated = false;

    if (selected.length !== selectedValues.length) {
      valueUpdated = true;
    } else {
      selected.map((value) => (valueUpdated = selectedValues.some((prevVal) => value.id !== prevVal.id)));
    }
    setValueUpdated(valueUpdated);
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
                  <Separator orientation="vertical" className="mx-2 h-4" />
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
        <Command>
          <CommandInput placeholder={`Search ${title}`} />
          <CommandList>
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
            {isValueUpdated && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem className="justify-center text-center" onSelect={() => onSelect(selected)}>
                    Update
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
