import React, { useState, useEffect } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem, CommandList, CommandSeparator, CommandEmpty } from "./command";
import { ComboboxOptions } from "@/types";
import { cn } from "@/lib/utils";

type ComboBoxProps = {
  icon?: React.ReactElement;
  options: any[];
  searchable?: boolean;
  label: string;
  tabIndex?: number;
  disabled?: boolean;
  selectedItem: any;
  handleSelect?: (item: string) => void;
  placeholder?: string;
  className?: string;
};

const ComboBox: React.FC<ComboBoxProps> = ({
  icon,
  placeholder,
  options,
  searchable = false,
  label,
  tabIndex,
  disabled,
  selectedItem,
  handleSelect,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<ComboboxOptions[]>([]);
  const [groupedOptions, setGroupedOptions] = useState<any[]>([]);
  const [filteredGroupedOptions, setFilteredGroupedOptions] = useState<any[]>([]);
  const isProjectDropdown = label === "Project";

  useEffect(() => {
    if (isProjectDropdown) {
      const grouped = Object.values(
        options.reduce((acc: any, item: any) => {
          const clientId = item.client.id;

          if (!acc[clientId]) {
            acc[clientId] = {
              clientId: item.client.id,
              clientName: item.client.name,
              projects: [],
            };
          }

          acc[clientId].projects.push(item);

          return acc;
        }, {}),
      )?.sort((a: any, b: any) => a.clientName.localeCompare(b.clientName));
      setGroupedOptions(grouped);
      setFilteredGroupedOptions(grouped); // Initialize the filtered state for grouped options
    } else {
      // If it's not grouped, just set the options normally
      setFilteredOptions(options);
    }
    setInputValue("");
  }, [options, isProjectDropdown, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setInputValue(value);

    if (isProjectDropdown) {
      // Filter by clientName and projectName for grouped options
      const filtered = groupedOptions
        .map((group) => ({
          ...group,
          projects: group.projects.filter(
            (project: any) =>
              project.name.toLowerCase().includes(value) || group.clientName.toLowerCase().includes(value),
          ),
        }))
        .filter((group) => group.projects.length > 0);

      setFilteredGroupedOptions(filtered);
    } else {
      // Normal filtering for non-grouped options
      setFilteredOptions(options.filter((option: any) => option.name.toLowerCase().includes(value)));
    }
  };

  const handleOptionSelect = (option: ComboboxOptions) => {
    handleSelect?.(option?.id.toString());
    setOpen(false);
    setInputValue("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          title={`Select a ${label}`}
          variant="outline"
          role="combobox"
          size="sm"
          tabIndex={searchable && open ? -1 : tabIndex}
          disabled={disabled}
          className="flex w-full justify-between"
        >
          {icon}
          <span className={cn("inline-block max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap")}>
            {selectedItem?.name || label}
          </span>
          <ChevronDown className="ml-auto h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        className={cn(
          "max-w-[256px] border-0 bg-popover p-0 text-popover-foreground transition-all ease-in",
          className,
        )}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <Command className={`${searchable ? "border" : "border-0"} box-border rounded-t-[5px] border-border`}>
          {searchable && (
            <div className="space-between flex w-full items-center rounded-t-[5px] border-b-[1px] border-border">
              <Search size={16} className="ml-[10px] text-gray-400" />
              <input
                tabIndex={tabIndex}
                className={`m-1 box-border h-[36px] rounded-none border-0 border-none border-border bg-popover pl-[5px] pr-[10px] text-[14px] text-popover-foreground placeholder:font-[14px] placeholder:opacity-75 focus:outline-none`}
                autoFocus
                placeholder={placeholder ?? "Search here..."}
                value={inputValue}
                onChange={handleInputChange}
              />
            </div>
          )}
          {/* Grouped options */}
          {isProjectDropdown && filteredGroupedOptions.length > 0 ? (
            <CommandList className="max-h-[260px] w-full px-[5px] py-0">
              {filteredGroupedOptions.map((group, index) => (
                <React.Fragment key={group.clientId}>
                  <CommandGroup key={group.clientId} heading={group.clientName} className="px-0">
                    {group.projects.map((project: ComboboxOptions) => (
                      <CommandItem
                        key={project.id}
                        value={`${project.id}`}
                        onSelect={() => handleOptionSelect(project)}
                        className="w-full cursor-pointer justify-between"
                      >
                        <span>{project.name}</span>
                        {selectedItem?.id === project.id && <Check size={16} className="shrink-0" />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {index !== filteredGroupedOptions.length - 1 && <CommandSeparator />}
                </React.Fragment>
              ))}
            </CommandList>
          ) : /* Normal options */
          !isProjectDropdown && filteredOptions.length > 0 ? (
            <CommandList className="max-h-[260px] w-full px-[5px] py-[8px]">
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.id}
                  value={`${option.id}`}
                  onSelect={() => handleOptionSelect(option)}
                  className="w-full cursor-pointer justify-between"
                >
                  {option.name}
                  {selectedItem?.id === option.id && <Check size={16} className="shrink-0" />}
                </CommandItem>
              ))}
            </CommandList>
          ) : (
            <CommandEmpty className="w-full p-3 text-xs" onClick={() => setOpen(false)}>
              No options found!
            </CommandEmpty>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export { ComboBox };
