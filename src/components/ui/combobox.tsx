import React, { useState, useRef, useEffect } from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { SearchIcon } from "lucide-react"

type ComboBoxOption = {
  groupHeading: string;
  group: [string]
};

type ComboBoxProps = {
  options: ComboBoxOption[];
  searchable?: boolean
  onSelected: (group: string) => void;
  placeholder?: string;
  icon?: React.ReactElement;
  containerStyles?: React.CSSProperties;
  ComboBoxStyles?: React.CSSProperties;
  toggleButtonStyles?: React.CSSProperties;
  inputStyles?: React.CSSProperties;
  optionListStyles?: React.CSSProperties;
  optionStyles?: React.CSSProperties;
  label: string;
  defaultValue?: string;
  tabIndex?: number;
  disable?: boolean;
  autoOpen?: boolean;
  group?: boolean;
};

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={`absolute bg-white dark:bg-zinc-900 border dark:border-borderColor-dark border-borderColor-light border-box top-[37px] rounded-t-[5px] w-[206px] ${className}`}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className='w-full rounded-t-[5px] flex items-center space-between'>
    <SearchIcon className="basis-[15%] h-[14px] text-info-light stroke-2 shrink-0" />
    <CommandPrimitive.Input
      ref={ref}
      className={`px-0 border-0 box-border dark:bg-transparent rounded-t-[5px] text-[14px] placeholder:font-[14px] focus:outline-0 focus:ring-0 w-[83%] ${className}`}
      {...props}
    />
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName


const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={`w-[calc(100%+2px)] py-[7px] px-[10px] border border-box border-borderColor-light dark:border-borderColor-dark max-h-[240px] overflow-y-auto ComboBox-scrollbar shadow-md rounded-b-[5px] absolute top-full left-1/2 -translate-x-1/2 bg-white dark:bg-transparent text-content-light transition-all duration-200 ease-out ${className}`}
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="inline-flex text-sm items-center gap-2"
    {...props}
  />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={`text-[#6B7280] text-sm [&_[cmdk-group-heading]]:px-[2px] [&_[cmdk-group-heading]]:py-2 select-none ${className}`}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={`aria-selected:bg-indigo-50 dark:aria-selected:bg-zinc-700 aria-selected:text-slate-700 dark:aria-selected:text-zinc-900 cursor-pointer w-full rounded py-2 px-[14px] text-[#374151] ${className}`}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

const ComboBox: React.FC<ComboBoxProps> = ({ options, onSelected, searchable = false, icon, placeholder = 'Search an option', containerStyles, ComboBoxStyles, toggleButtonStyles, inputStyles, optionListStyles, optionStyles, label, defaultValue, tabIndex, disable, autoOpen, group=false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | undefined>()
  const parentRef = useRef<HTMLDivElement>(null)

  function handleSelect(option: string) {
    onSelected(option);
    setSelected(option)
    setIsOpen(false);
  }

  const handleOutsideClick = (e: any) => {
    if (
      isOpen &&
      parentRef.current &&
      !parentRef.current.contains(e.target)
    ) {
      setSearchTerm('')
      setIsOpen(false);
    }
  };

  const handleClick = (e:any) => {
    e.stopPropagation()
    setIsOpen(true)
  }

  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false)
      setSearchTerm('')
  }, 200)
  }

  useEffect(() => {
    setSelected(defaultValue)
  }, [defaultValue])

  useEffect(() => {
    if(autoOpen !== undefined) setIsOpen(autoOpen)
  }, [autoOpen])

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className={`relative ${containerStyles}`}>
      <div className="w-full">
        <button tabIndex={searchable && isOpen ? -1 : tabIndex} disabled={disable} className={`disabled:opacity-50 rounded-md transition-all duration-[50] ease-out capitalize focus:outline-0 focus:outline-offset-0 px-3 text-[14px] inline-flex items-center justify-center gap-[6px] border-ComboBoxBorder-light dark:border-borderColor-dark bg-white dark:bg-zinc-800 hover:bg-background-light text-content-light dark:text-white border py-[6px] pl-[10px] pr-[11px] ${toggleButtonStyles}`} onClick={handleClick} onFocus={() => setIsOpen(true)}>
          {icon}
          <span>{selected || label}</span>
        </button>
        {isOpen && <Command className={`${ComboBoxStyles}`}>
          {searchable && <CommandInput onBlur={handleBlur} tabIndex={tabIndex} className={`${inputStyles}`} autoFocus placeholder='Search' value={searchTerm} onChangeCapture={(e: any) => setSearchTerm(e.target.value)} />}
          <CommandList>
            <CommandEmpty>
              No results found.
            </CommandEmpty>
            {options?.map((x: any, i: any) => {
              return (
                <React.Fragment key={i}>
                  <CommandGroup
                    className={`${optionListStyles}`}
                    heading={group ? x.groupHeading : ''}
                  >
                    {x.group.map((project: any, innerI: any) => {
                      return (
                        <div key={innerI}>
                          <CommandItem
                            value={project}
                            onSelect={handleSelect}
                            className={`${optionStyles}`}
                          >
                            {project}
                          </CommandItem>
                        </div>
                      );
                    })}
                  </CommandGroup>
                </React.Fragment>
              );
            })}
          </CommandList>
        </Command>}
      </div>
    </div>
  );
};

export default ComboBox;
