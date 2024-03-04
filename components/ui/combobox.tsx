import { useState, useEffect, useRef } from "react";
import { UseFormSetValue } from "react-hook-form";
import { Check, ChevronDown } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command";
import { Input } from "./input";
import { ComboboxOptions, AssignFormValues } from "@/types";
import { cn } from "@/lib/utils";

type InlineComboboxProps = {
  options: ComboboxOptions[];
  setVal: UseFormSetValue<AssignFormValues> | any;
  fieldName: string;
  icon: React.ReactNode;
  label: string;
  defaultValue?: number;
  selectHandler?: (id: number) => void;
};

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
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<ComboboxOptions[]>(options);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setFilteredOptions(options.filter((option) => option.name.toLowerCase().includes(value.toLowerCase())));
  };

  const handleOptionSelect = (option: ComboboxOptions) => {
    handleSelect?.(option?.id.toString());
    setOpen(false);
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
          <span className="mx-[6px] inline-block max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
            {selectedItem?.name || label}
          </span>
          <ChevronDown className="ml-auto h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        className="max-w-[230px] border-0 bg-popover p-0 text-popover-foreground transition-all ease-in"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <Command className={`${searchable ? "border" : "border-0"} border-box rounded-t-[5px] border-border`}>
          {options.length > 0 ? (
            <>
              {searchable && (
                <div className="space-between flex w-full items-center rounded-t-[5px]">
                  <Input
                    tabIndex={tabIndex}
                    className={`m-1 box-border h-[36px] rounded-none border-0 border-none border-border bg-popover px-[10px] text-[14px] text-popover-foreground placeholder:font-[14px] placeholder:opacity-75 focus:outline-none`}
                    autoFocus
                    placeholder={placeholder ?? "Search here..."}
                    value={inputValue}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              <CommandList className="max-h-[200px] w-full px-[5px] py-[8px]">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <CommandItem
                      key={option.id}
                      value={`${option.id}`}
                      onSelect={() => handleOptionSelect(option)}
                      className="w-full cursor-pointer justify-between"
                    >
                      {option.name}
                      {selectedItem?.id === option.id && <Check size={16} className="shrink-0" />}
                    </CommandItem>
                  ))
                ) : (
                  <CommandEmpty className="px-[14px] py-2 text-[14px]">No results found.</CommandEmpty>
                )}
              </CommandList>
            </>
          ) : (
            <div className="w-full cursor-pointer p-3 text-sm" onClick={() => setOpen(false)}>
              No options found!
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const InlineCombobox = ({
  options,
  setVal,
  fieldName,
  icon,
  label,
  defaultValue,
  selectHandler,
}: InlineComboboxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>();

  const handleValueChange = (e: string) => {
    setInputValue(e);
    setOpen(true);
  };

  useEffect(() => {
    if (defaultValue) {
      const selectedUser = options.find((option) => option.id === defaultValue);
      setInputValue(selectedUser?.name ? selectedUser?.name : "");
      setVal(fieldName, selectedUser?.id);
    }
  }, [defaultValue]);

  return (
    <Command
      className={cn(
        "mt-2 h-auto w-full overflow-visible rounded-md border bg-transparent",
        open && "ring-2 ring-ring ring-offset-0",
      )}
    >
      {/* Avoid having the "Search" Icon */}
      <div className="flex items-center px-3" cmdk-input-wrapper="">
        {icon}
        <CommandInput
          ref={inputRef}
          value={inputValue}
          onValueChange={handleValueChange}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          placeholder={`Select ${label}...`}
          className="rounded-0 flex-1 border-0 bg-transparent pl-1 outline-none placeholder:text-muted-foreground focus:ring-0"
        />
      </div>

      <div className="relative">
        {open && options.length > 0 ? (
          <div className="absolute top-2 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {options.map((option) => {
                return (
                  option.name && (
                    <CommandItem
                      key={option.id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        if (option.name) setInputValue(option.name);
                        setVal(fieldName, option.id);
                        setOpen(false);
                        selectHandler && selectHandler(option.id);
                      }}
                      className={"cursor-pointer py-1.5 pl-8 pr-2"}
                    >
                      {option.name}
                    </CommandItem>
                  )
                );
              })}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  );
};

export { ComboBox, InlineCombobox };
