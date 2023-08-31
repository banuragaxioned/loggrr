import { useState, Dispatch } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Icons } from "./icons";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}
interface DataTableVisibilityTogglerProps<TData, TValue> {
  selectionHandler: Dispatch<string>;
  title?: string;
  options: option[];
}

export function DataTableVisibilityToggler<TData, TValue>({
  selectionHandler,
  title,
  options,
}: DataTableVisibilityTogglerProps<TData, TValue>) {
  const [selected, setSelected] = useState<option>(options[0]);
  const clickHandler = (option: option) => {
    setSelected(option);
    selectionHandler(option.label);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <Icons.add className="mr-2 h-4 w-4" />
          {title}
          <Separator orientation="vertical" className="mx-2 h-4" />
          <Badge variant="secondary" className="rounded-sm px-1 font-normal">
            {selected.label}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                return (
                  <CommandItem onSelect={() => clickHandler(option)}>
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        selected.value === option.value
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <Icons.check className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                    <span>{option.value}</span>
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
