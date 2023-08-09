import { useState, useEffect, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command";
import { UseFormSetValue } from "react-hook-form";
import { ChevronDown, SearchIcon } from "lucide-react";
import { ComboboxOptions, AssignFormValues } from "@/types";
import { cn } from "@/lib/utils";

type InlineComboboxProps = {
  options: ComboboxOptions[];
  setVal: UseFormSetValue<AssignFormValues> | any;
  fieldName: "projectId" | "userId";
  icon: React.ReactNode;
  label: string;
};

type ComboBoxProps = {
  icon?: React.ReactElement;
  options: any[];
  searchable?: boolean;
  label: string;
  tabIndex?: number;
  disable?: boolean;
  group?: boolean;
  selectedItem: string | undefined;
  handleGroupSelect?: (item: string, groupName: string) => void | undefined;
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
  disable,
  group = false,
  selectedItem,
  handleSelect,
  handleGroupSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) setSearchTerm("");
  }, [isOpen]);

  return (
    <div className={`relative`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            title={selectedItem}
            variant="primary"
            role="combobox"
            tabIndex={searchable && isOpen ? -1 : tabIndex}
            disabled={disable}
            className={`flex justify-between`}
          >
            {icon}
            <span className="mx-[6px] inline-block max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
              {selectedItem || label}
            </span>
            <ChevronDown className="ml-auto h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          align="start"
          className="max-w-[230px] border-0 bg-popover p-0 text-popover-foreground transition-all ease-in"
        >
          <Command className={`${searchable ? "border" : "border-0"} border-box rounded-t-[5px] border-border`}>
            {searchable && (
              <div className="space-between flex w-full items-center rounded-t-[5px]">
                <CommandInput
                  tabIndex={tabIndex}
                  className={`text-popover-foregroun box-border border-0 border-none border-border bg-popover px-0 text-[14px] placeholder:font-[14px] placeholder:opacity-75 focus:outline-0 focus:ring-0`}
                  autoFocus
                  placeholder={placeholder ?? "Search here..."}
                  value={searchTerm}
                  onChangeCapture={(e: any) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
            <CommandList
              className={`border border-border ${
                searchable ? "border-t-0" : "rounded-t-[5px]"
              } scrollbar border-box ComboBox-scrollbar absolute left-1/2 top-full max-h-[240px] w-full -translate-x-1/2 overflow-y-auto rounded-b-[5px] bg-popover px-[5px] py-[8px] shadow-md transition-all duration-200 ease-out`}
            >
              <CommandEmpty className="px-[14px] py-2 text-[14px]">No results found.</CommandEmpty>
              {options.length > 0 &&
                (group
                  ? options?.map((group: any) => {
                      const groupName = group.groupName;
                      return (
                        <CommandGroup
                          key={group.id}
                          className={`select-none px-0 text-sm [&_[cmdk-group-heading]]:px-[2px] [&_[cmdk-group-heading]]:py-2`}
                          heading={groupName ? <div className="px-[7px] tracking-wide">{groupName}</div> : ""}
                        >
                          {group?.list?.length > 0 &&
                            group?.list.map((item: any, innerI: any) => {
                              return (
                                <CommandItem
                                  key={item.id}
                                  value={item.value}
                                  className="w-full cursor-pointer rounded px-[18px] py-2 text-[14px]"
                                  onSelect={(val: string) => {
                                    handleGroupSelect && handleGroupSelect(val, groupName);
                                    setIsOpen(false);
                                  }}
                                >
                                  {item.name}
                                </CommandItem>
                              );
                            })}
                        </CommandGroup>
                      );
                    })
                  : options?.map((item: any) => {
                      return (
                        <CommandItem
                          key={item.id}
                          value={item.value}
                          onSelect={(val: string) => {
                            handleSelect && handleSelect(val);
                            setIsOpen(false);
                          }}
                          className="w-full cursor-pointer rounded px-[14px] py-2 text-[14px]"
                        >
                          {item.name}
                        </CommandItem>
                      );
                    }))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const InlineCombobox = ({ options, setVal, fieldName, icon, label }: InlineComboboxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleValueChange = (e:string) => {
    setInputValue(e)
    setOpen(true)
  }
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
