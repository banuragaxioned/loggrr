import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./combobox";

type ComboBoxProps = {
  icon?: React.ReactElement;
  containerStyles?: React.CSSProperties;
  ComboBoxStyles?: React.CSSProperties;
  toggleButtonStyles?: React.CSSProperties;
  inputStyles?: React.CSSProperties;
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
            className={`border-ComboBoxBorder-light inline-flex max-w-[200px] items-center justify-center gap-[6px] rounded-md border bg-white px-3 py-[6px] pl-[10px] pr-[11px] text-[14px] capitalize text-content-light transition-all duration-75 ease-out hover:bg-background-light focus:outline-0 focus:outline-offset-0 disabled:opacity-50 dark:border-borderColor-dark dark:bg-zinc-800 dark:text-white ${toggleButtonStyles}`}
          >
            {icon}
            <span className="inline-block max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
              {selectedItem || label}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-w-[250px] bg-white p-0" align="start" side="bottom" sideOffset={-30}>
          {isOpen && (
            <Command className={`${ComboBoxStyles}`}>
              {searchable && (
                <CommandInput
                  tabIndex={tabIndex}
                  className={`border-none ${inputStyles}`}
                  autoFocus
                  placeholder={placeholder ?? "Search here..."}
                  value={searchTerm}
                  onChangeCapture={(e: any) => setSearchTerm(e.target.value)}
                />
              )}
              <CommandList className="locale-dropdown">
                <CommandEmpty>No results found.</CommandEmpty>
                {options.length > 0 &&
                  (group
                    ? options?.map((group: any) => {
                        const groupName = group.groupName;
                        return (
                          <CommandGroup
                            key={group.id}
                            className={`${optionListStyles}`}
                            heading={groupName ? groupName : ""}
                          >
                            {group?.list?.length > 0 &&
                              group?.list.map((item: any, innerI: any) => {
                                return (
                                  <div key={innerI}>
                                    <CommandItem
                                      value={item.value}
                                      onSelect={(val: string) => {
                                        handleGroupSelect && handleGroupSelect(val, groupName);
                                        setIsOpen(false);
                                      }}
                                      className={`${optionStyles}`}
                                    >
                                      {item.name}
                                    </CommandItem>
                                  </div>
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
                            className={`${optionStyles}`}
                          >
                            {item.name}
                          </CommandItem>
                        );
                      }))}
              </CommandList>
            </Command>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ComboBox;
