import * as React from "react";
import { Check, ChevronsUpDown, List, SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type List = Record<"value" | "label", string>;

interface FancyBoxProps {
  options: List[];
  selectedValues: List[];
  setSelectedValues: React.Dispatch<React.SetStateAction<List[]>>;
  defaultLabel: string;
}

export function FancyBox({ options, selectedValues, setSelectedValues, defaultLabel }: FancyBoxProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [list, setList] = React.useState<List[]>(options);
  const [openCombobox, setOpenCombobox] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string>("");

  const toggleList = (list: List) => {
    setSelectedValues((prev) => (!prev.includes(list) ? [...prev, list] : prev.filter((l) => l.value !== list.value)));
    inputRef?.current?.focus();
  };

  const createListItem = (name: string) => {
    const newList = {
      value: name.toLowerCase(),
      label: name,
    };
    setList((prev) => [...prev, newList]);
    setSelectedValues((prev) => [...prev, newList]);
  };

  const onComboboxOpenChange = (value: boolean) => {
    inputRef.current?.blur();
    setOpenCombobox(value);
  };

  return (
    <div className="max-w-[200px]">
      <Popover open={openCombobox} onOpenChange={onComboboxOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCombobox}
            className="w-[200px] justify-between text-foreground"
          >
            <span className="truncate">
              {selectedValues.length === 0 && defaultLabel}
              {selectedValues.length === 1 && selectedValues[0].label}
              {selectedValues.length > 1 && `${selectedValues[0].label} + ${selectedValues.length - 1} more`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          align="start"
          className="max-w-[230px] border-0 bg-popover p-0 text-popover-foreground transition-all ease-in"
        >
          <Command loop className="border-box rounded-t-md border border-border">
            <div className="space-between flex w-full items-center rounded-t-md">
              <SearchIcon className="h-[14px] shrink-0 basis-[15%] stroke-2" />
              <CommandInput
                ref={inputRef}
                placeholder="Search list..."
                value={inputValue}
                onValueChange={setInputValue}
                className={`box-border overflow-hidden rounded-t-sm border-0 bg-popover px-0 text-sm leading-6 text-popover-foreground placeholder:text-sm placeholder:leading-6 placeholder:opacity-75 focus:outline-0 focus:ring-0`}
              />
            </div>
            <CommandList
              className={`scrollbar border-box ComboBox-scrollbar absolute left-1/2 top-full max-h-[240px] w-full -translate-x-1/2 overflow-y-auto rounded-b-[5px] border-x border-b border-border bg-popover px-[5px] py-[8px] shadow-md transition-all duration-200 ease-out`}
            >
              <CommandEmpty className="px-[14px] py-2 text-[14px]">No results found.</CommandEmpty>
              <CommandGroup className="scrollbar ComboBox-scrollbar select-none overflow-auto px-0 text-sm">
                {list.map((list) => {
                  const isActive = selectedValues.includes(list);
                  return (
                    <CommandItem
                      key={list.value}
                      value={list.value}
                      onSelect={() => toggleList(list)}
                      className="flex w-full cursor-pointer justify-between rounded bg-popover px-[18px] py-2 text-sm text-popover-foreground"
                    >
                      <Check className={cn("mr-2 h-4 w-4", isActive ? "opacity-100" : "opacity-0")} />
                      <div className="flex-1">{list.label}</div>
                    </CommandItem>
                  );
                })}
                <CommandItemCreate onSelect={() => createListItem(inputValue)} {...{ inputValue, list }} />
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

const CommandItemCreate = ({
  inputValue,
  list,
  onSelect,
}: {
  inputValue: string;
  list: List[];
  onSelect: () => void;
}) => {
  const hasNoList = !list.map(({ value }) => value).includes(`${inputValue.toLowerCase()}`);

  const render = inputValue !== "" && hasNoList;

  if (!render) return null;

  // BUG: whenever a space is appended, the Create-Button will not be shown.
  return (
    <CommandItem
      key={`${inputValue}`}
      value={`${inputValue}`}
      className="w-full cursor-pointer rounded-md px-[18px] py-2 text-sm text-muted-foreground aria-selected:bg-hover"
      onSelect={onSelect}
    >
      Create new label &quot;{inputValue}&quot;
    </CommandItem>
  );
};
