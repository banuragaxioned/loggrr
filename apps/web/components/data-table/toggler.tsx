import { useState, Dispatch } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  const [selected, setSelected] = useState<option>(options[0] ?? { label: "", value: "" });
  const clickHandler = (option: option) => {
    setSelected(option);
    selectionHandler(option.value);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
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
                    {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
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
