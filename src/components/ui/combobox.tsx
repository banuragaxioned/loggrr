import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command";
import { ChevronDown, SearchIcon } from "lucide-react";

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
    if(!isOpen) setSearchTerm('')
  }, [isOpen])

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
            <span className="inline-block max-w-[200px] mx-[6px] overflow-hidden text-ellipsis whitespace-nowrap">
              {selectedItem || label}
            </span>
            <ChevronDown className="h-4 w-4 ml-auto" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="start" className="max-w-[230px] bg-popover text-popover-foreground p-0 transition-all ease-in border-0">
          <Command className={`${searchable ? 'border' : 'border-0'} border-box rounded-t-[5px] border-border`}>
            {searchable && (
              <div className="space-between flex w-full items-center rounded-t-[5px]">
                <SearchIcon className="h-[14px] shrink-0 basis-[15%] stroke-2" />
                <CommandInput
                  tabIndex={tabIndex}
                  className={`border-none text-popover-foregroun border-border box-border rounded-t-[5px] border-0 px-0 text-[14px] bg-popover placeholder:opacity-75 placeholder:font-[14px] focus:outline-0 focus:ring-0`}
                  autoFocus
                  placeholder={placeholder ?? "Search here..."}
                  value={searchTerm}
                  onChangeCapture={(e: any) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
            <CommandList className={`border border-border ${searchable ? 'border-t-0' : 'rounded-t-[5px]'} scrollbar border-box ComboBox-scrollbar absolute left-1/2 top-full max-h-[240px] w-full -translate-x-1/2 overflow-y-auto rounded-b-[5px] bg-popover px-[5px] py-[8px] shadow-md transition-all duration-200 ease-out`}>
              <CommandEmpty className="px-[14px] py-2 text-[14px]">No results found.</CommandEmpty>
              {options.length > 0 &&
                (group
                  ? options?.map((group: any) => {
                    const groupName = group.groupName;
                    return (
                      <CommandGroup
                        key={group.id}
                        className={`px-0 select-none text-sm [&_[cmdk-group-heading]]:px-[2px] [&_[cmdk-group-heading]]:py-2`}
                        heading={groupName ? <div className="px-[7px] tracking-wider font-medium text-muted-foreground">{groupName}</div> : ""}
                      >
                        {group?.list?.length > 0 &&
                          group?.list.map((item: any, innerI: any) => {
                            return (
                              <CommandItem
                                key={item.id}
                                value={item.value}
                                className="w-full cursor-pointer rounded px-[18px] py-2 text-[14px] aria-selected:bg-accent"
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
                        className="w-full cursor-pointer rounded px-[14px] py-2 text-[14px] aria-selected:bg-accent"
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