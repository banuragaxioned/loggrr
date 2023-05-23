"use client";

import * as React from "react";
import { Check, ChevronsUpDown, SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Framework = Record<"value" | "label", string>;

const FRAMEWORKS = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
  {
    value: "wordpress",
    label: "WordPress",
  },
]satisfies Framework[];

export function FancyBox() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [frameworks, setFrameworks] = React.useState<Framework[]>(FRAMEWORKS);
  const [openCombobox, setOpenCombobox] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [selectedValues, setSelectedValues] = React.useState<Framework[]>([]);

  const toggleFramework = (framework: Framework) => {
    setSelectedValues((currentFrameworks) =>
      !currentFrameworks.includes(framework)
        ? [...currentFrameworks, framework]
        : currentFrameworks.filter((l) => l.value !== framework.value)
    );
    inputRef?.current?.focus();
  };

  const createFramework = (name: string) => {
    const newFramework = {
      value: name.toLowerCase(),
      label: name,
    };
    setFrameworks((prev) => [...prev, newFramework]);
    setSelectedValues((prev) => [...prev, newFramework]);
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
              {selectedValues.length === 0 && "Select labels"}
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
          <Command loop className="border border-box rounded-t-md border-border">
            <div className="space-between flex w-full items-center rounded-t-md">
              <SearchIcon className="h-[14px] shrink-0 basis-[15%] stroke-2" />
              <CommandInput
                ref={inputRef}
                placeholder="Search framework..."
                value={inputValue}
                onValueChange={setInputValue}
                className={`text-popover-foreground border-0 box-border rounded-t-sm bg-popover px-0 text-sm leading-6 placeholder:leading-6 placeholder:text-sm placeholder:opacity-75 focus:outline-0 focus:ring-0 overflow-hidden`}
              />
            </div>
            <CommandList
              className={`border-x border-b border-border scrollbar border-box ComboBox-scrollbar absolute left-1/2 top-full max-h-[240px] w-full -translate-x-1/2 overflow-y-auto rounded-b-[5px] bg-popover px-[5px] py-[8px] shadow-md transition-all duration-200 ease-out`}
            >
            <CommandEmpty className="px-[14px] py-2 text-[14px]">No results found.</CommandEmpty>
            <CommandGroup className="scrollbar ComboBox-scrollbar overflow-auto select-none px-0 text-sm">
              {frameworks.map((framework) => {
                const isActive = selectedValues.includes(framework);
                return (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={() => toggleFramework(framework)}
                    className="w-full flex justify-between cursor-pointer rounded px-[18px] py-2 text-[14px] aria-selected:bg-hover"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isActive ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex-1">{framework.label}</div>
                  </CommandItem>
                );
              })}
               <CommandItemCreate
                onSelect={() => createFramework(inputValue)}
                {...{ inputValue, frameworks }}
              />
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
  frameworks,
  onSelect,
}: {
  inputValue: string;
  frameworks: Framework[];
  onSelect: () => void;
}) => {
  const hasNoFramework = !frameworks
    .map(({ value }) => value)
    .includes(`${inputValue.toLowerCase()}`);

  const render = inputValue !== "" && hasNoFramework;

  if (!render) return null;

  // BUG: whenever a space is appended, the Create-Button will not be shown.
  return (
    <CommandItem
      key={`${inputValue}`}
      value={`${inputValue}`}
      className="w-full cursor-pointer px-[18px] py-2 text-xs text-muted-foreground aria-selected:bg-hover rounded-md"
      onSelect={onSelect}
    >
      Create new label &quot;{inputValue}&quot;
    </CommandItem>
  );
};
