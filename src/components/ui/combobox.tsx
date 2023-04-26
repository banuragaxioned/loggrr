import React, { useState, useRef } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";

// type ComboBoxOption = {
//   groupHeading: string;
//   group: [string];
// };

// type ComboBoxProps = {
//   options: any[];
//   searchable?: boolean;
//   // onSelected?: (group: string) => void;
//   placeholder?: string;
//   icon?: React.ReactElement;
//   containerStyles?: React.CSSProperties;
//   ComboBoxStyles?: React.CSSProperties;
//   toggleButtonStyles?: React.CSSProperties;
//   inputStyles?: React.CSSProperties;
//   optionListStyles?: React.CSSProperties;
//   optionStyles?: React.CSSProperties;
//   label: string;
//   defaultValue?: string;
//   tabIndex?: number;
//   disable?: boolean;
//   autoOpen?: boolean;
//   group?: boolean;

//   selectedItem: string | undefined;
//   // setSelectedItem: (group: string) => void;
//   handleGroupSelect?: (item: string, groupName: string) => void | undefined;
//   handleSelect?: (item: string) => void;
// };

export const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={`border-box absolute top-[37px] w-[206px] rounded-t-[5px] border border-borderColor-light bg-white dark:border-borderColor-dark dark:bg-zinc-900 ${className}`}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

export const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="space-between flex w-full items-center rounded-t-[5px]">
    <SearchIcon className="h-[14px] shrink-0 basis-[15%] stroke-2 text-info-light" />
    <CommandPrimitive.Input
      ref={ref}
      className={`box-border w-[83%] rounded-t-[5px] border-0 px-0 text-[14px] placeholder:font-[14px] focus:outline-0 focus:ring-0 dark:bg-transparent ${className}`}
      {...props}
    />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

export const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={`border-box ComboBox-scrollbar absolute left-1/2 top-full max-h-[240px] w-[calc(100%+2px)] -translate-x-1/2 overflow-y-auto rounded-b-[5px] border border-borderColor-light bg-white pl-[10px] pr-0 py-[7px] text-content-light shadow-md transition-all duration-200 ease-out dark:border-borderColor-dark dark:bg-transparent ${className}`}
    {...props}
  />
));

CommandList.displayName = CommandPrimitive.List.displayName;

export const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => <CommandPrimitive.Empty ref={ref} className="inline-flex items-center gap-2 text-sm" {...props} />);

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

export const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={`select-none text-sm text-[#6B7280] [&_[cmdk-group-heading]]:px-[2px] [&_[cmdk-group-heading]]:py-2 ${className}`}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

export const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={`w-full cursor-pointer rounded px-[14px] py-2 text-[#374151] aria-selected:bg-indigo-50 aria-selected:text-slate-700 dark:aria-selected:bg-zinc-700 dark:aria-selected:text-zinc-900 ${className}`}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

// const ComboBox1: React.FC<ComboBoxProps> = ({
//   options,
//   // onSelected,
//   searchable = false,
//   icon,
//   placeholder = "Search an option",
//   containerStyles,
//   ComboBoxStyles,
//   toggleButtonStyles,
//   inputStyles,
//   optionListStyles,
//   optionStyles,
//   label,
//   defaultValue,
//   tabIndex,
//   disable,
//   autoOpen,
//   group = false,

//   // setSelectedItem,
//   selectedItem,
//   handleSelect,
//   handleGroupSelect,
// }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   // const [selected, setSelected] = useState<any>();
//   const parentRef = useRef<HTMLDivElement>(null);

//   // function handleSelect(option: string) {
//   //   onSelected(option);
//   //   setSelected(option);
//   //   setIsOpen(false);
//   // }

//   // const handleOutsideClick = useCallback(
//   //   (e: any) => {
//   //     if (isOpen && parentRef.current && !parentRef.current.contains(e.target)) {
//   //       setSearchTerm("");
//   //       setIsOpen(false);
//   //     }
//   //   },
//   //   [isOpen]
//   // );

//   // const handleClick = (e: any) => {
//   //   e.stopPropagation();
//   //   setIsOpen(true);
//   // };

//   // const handleBlur = () => {
//   //   setTimeout(() => {
//   //     setIsOpen(false);
//   //     setSearchTerm("");
//   //   }, 200);
//   // };

//   // useEffect(() => {
//   //   setSelected(defaultValue);
//   // }, [defaultValue]);

//   // useEffect(() => {
//   //   if (autoOpen !== undefined) setIsOpen(autoOpen);
//   // }, [autoOpen]);

//   // useEffect(() => {
//   //   document.addEventListener("mousedown", handleOutsideClick);

//   //   return () => {
//   //     document.removeEventListener("mousedown", handleOutsideClick);
//   //   };
//   // }, [isOpen, handleOutsideClick]);

//   return (
//     // <div>
//     <Popover
//       open={isOpen}
//       onOpenChange={setIsOpen}
//       // className={`relative ${containerStyles}`}
//     >
//       {/* <div className="w-full">
//         <button
//           tabIndex={searchable && isOpen ? -1 : tabIndex}
//           disabled={disable}
//           className={`border-ComboBoxBorder-light inline-flex items-center justify-center gap-[6px] rounded-md border bg-white px-3 py-[6px] pl-[10px] pr-[11px] text-[14px] capitalize text-content-light transition-all duration-75 ease-out hover:bg-background-light focus:outline-0 focus:outline-offset-0 disabled:opacity-50 dark:border-borderColor-dark dark:bg-zinc-800 dark:text-white ${toggleButtonStyles}`}
//           onClick={handleClick}
//           onFocus={() => setIsOpen(true)}
//         >
//           {icon}
//           <span>{selected || label}</span>
//         </button> */}
//       <PopoverTrigger asChild>
//         <Button
//           title={selectedItem}
//           variant="outline"
//           role="combobox"
//           // aria-expanded={open}
//           tabIndex={searchable && isOpen ? -1 : tabIndex}
//           disabled={disable}
//           className={`max-w-[200px] border-ComboBoxBorder-light inline-flex items-center justify-center gap-[6px] rounded-md border bg-white px-3 py-[6px] pl-[10px] pr-[11px] text-[14px] capitalize text-content-light transition-all duration-75 ease-out hover:bg-background-light focus:outline-0 focus:outline-offset-0 disabled:opacity-50 dark:border-borderColor-dark dark:bg-zinc-800 dark:text-white ${toggleButtonStyles}`}
//           // onClick={handleClick}
//           // onFocus={() => setIsOpen(true)}
//         >
//           {icon}
//           <span className="inline-block max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
//             {selectedItem || label}
//           </span>
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="max-w-[250px] bg-white p-0" align="start" side="top" sideOffset={-10}>
//         {isOpen && (
//           <Command className={`${ComboBoxStyles}`}>
//             {searchable && (
//               <CommandInput
//                 // onBlur={handleBlur}
//                 tabIndex={tabIndex}
//                 className={`${inputStyles}`}
//                 autoFocus
//                 placeholder="Search"
//                 value={searchTerm}
//                 onChangeCapture={(e: any) => setSearchTerm(e.target.value)}
//               />
//             )}
//             <CommandList>
//               <CommandEmpty>No results found.</CommandEmpty>
//               {options.length > 0 &&
//                 (group
//                   ? options?.map((group: any) => {
//                       const groupName = group.groupName;
//                       return (
//                         <CommandGroup
//                           key={group.id}
//                           className={`${optionListStyles}`}
//                           heading={groupName ? groupName : ""}
//                         >
//                           {group?.list?.length > 0 &&
//                             group?.list.map((item: any, innerI: any) => {
//                               return (
//                                 <div key={innerI}>
//                                   <CommandItem
//                                     value={item.value}
//                                     onSelect={(val: string) => {
//                                       handleGroupSelect && handleGroupSelect(val, groupName);
//                                       setIsOpen(false);
//                                     }}
//                                     className={`${optionStyles}`}
//                                   >
//                                     {item.name}
//                                   </CommandItem>
//                                 </div>
//                               );
//                             })}
//                         </CommandGroup>
//                       );
//                     })
//                   : options?.map((item: any) => {
//                       return (
//                         <CommandItem
//                           key={item.id}
//                           value={item.value}
//                           onSelect={(val: string) => {
//                             handleSelect && handleSelect(val);
//                             setIsOpen(false);
//                           }}
//                           className={`${optionStyles}`}
//                         >
//                           {item.name}
//                         </CommandItem>
//                       );
//                     }))}
//               {/* {group
//                 ? options?.length > 0 &&
//                   options?.map((item: any) => {
//                       return (
//                         <CommandItem key={item.id} value={item.value} onSelect={handleSelect} className={`${optionStyles}`}>
//                           {item.name}
//                         </CommandItem>
//                       );
//                   })
//                 : options?.map((group: any) => {
//                     return (
//                         <CommandGroup key={group.id} className={`${optionListStyles}`} heading={group.groupName ? group.groupName : ""}>
//                           {group.list.map((item: any, innerI: any) => {
//                             return (
//                               <div key={innerI}>
//                                 <CommandItem value={item.value} onSelect={handleSelect} className={`${optionStyles}`}>
//                                   {item.name}
//                                 </CommandItem>
//                               </div>
//                             );
//                           })}
//                         </CommandGroup>
//                     );
//                   })} */}
//             </CommandList>
//           </Command>
//         )}
//       </PopoverContent>
//     </Popover>
//   );
// };
