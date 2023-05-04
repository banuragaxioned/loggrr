import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command";
import { ChevronDown } from "lucide-react";

type ComboBoxProps = {
  icon?: React.ReactElement;
  containerStyles?: React.CSSProperties;
  ComboBoxStyles?: React.CSSProperties;
  toggleButtonStyles?: React.CSSProperties;
  inputStyles?: string;
  optionListStyles?: React.CSSProperties;
  optionStyles?: any
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
  containerStyles,
  ComboBoxStyles,
  toggleButtonStyles,
  inputStyles,
  optionListStyles,
  optionStyles,
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

  return (
    <div className={`relative ${containerStyles}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            title={selectedItem}
            variant="outline"
            role="combobox"
            tabIndex={searchable && isOpen ? -1 : tabIndex}
            disabled={disable}
            className={`border-ComboBoxBorder-light inline-flex w-[200px] items-center justify-start gap-[6px] rounded-md border bg-white px-3 py-[6px] pl-[10px] pr-[11px] text-[14px] capitalize text-content-light transition-all duration-75 ease-out hover:bg-background-light focus:outline-0 focus:outline-offset-0 disabled:opacity-50 dark:border-borderColor-dark dark:bg-zinc-800 dark:text-white ${toggleButtonStyles}`}
          >
            {icon}
            <span className="inline-block max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
              {selectedItem || label}
            </span>
            <ChevronDown className="h-4 w-4 ml-auto" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-w-[230px] bg-white p-0" align="start" side="bottom">
          <Command className={`${searchable ? 'border' : 'border-0'} border-box rounded-t-[5px] border-borderColor-light bg-white dark:border-borderColor-dark dark:bg-zinc-900`}>
            {searchable && (
              <CommandInput
                tabIndex={tabIndex}
                className={`border-none box-border rounded-t-[5px] border-0 px-0 text-[14px] placeholder:font-[14px] focus:outline-0 focus:ring-0 dark:bg-transparent`}
                autoFocus
                placeholder={placeholder ?? "Search here..."}
                value={searchTerm}
                onChangeCapture={(e: any) => setSearchTerm(e.target.value)}
              />
            )}
            <CommandList className={`border ${searchable ? 'border-t-0' : 'rounded-t-[5px]'} scrollbar border-box ComboBox-scrollbar absolute left-1/2 top-full max-h-[240px] w-full -translate-x-1/2 overflow-y-auto rounded-b-[5px] border-borderColor-light bg-white px-[5px] py-[8px] text-content-light shadow-md transition-all duration-200 ease-out dark:border-borderColor-dark dark:bg-transparent`}>
              <CommandEmpty>No results found.</CommandEmpty>
              {options.length > 0 &&
                (group
                  ? options?.map((group: any) => {
                    const groupName = group.groupName;
                    return (
                      <CommandGroup
                        key={group.id}
                        className={`px-0 select-none text-sm text-[#6B7280] [&_[cmdk-group-heading]]:px-[2px] [&_[cmdk-group-heading]]:py-2`}
                        heading={groupName ? <div className="px-[7px] font-light">{groupName}</div> : ""}
                      >
                        {group?.list?.length > 0 &&
                          group?.list.map((item: any, innerI: any) => {
                            return (
                              <CommandItem
                                key={item.id}
                                value={item.value}
                                className="w-full cursor-pointer rounded px-[18px] py-2 text-[#374151] aria-selected:bg-indigo-50 aria-selected:text-slate-700 dark:aria-selected:bg-zinc-700 dark:aria-selected:text-zinc-900"
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
                        className="w-full cursor-pointer rounded px-[14px] py-2 text-[#374151] aria-selected:bg-indigo-50 aria-selected:text-slate-700 dark:aria-selected:bg-zinc-700 dark:aria-selected:text-zinc-900"
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

export default ComboBox;