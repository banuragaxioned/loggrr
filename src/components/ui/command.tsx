import React, { useState, useRef } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";

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
    className={`border-box ComboBox-scrollbar absolute left-1/2 top-full max-h-[240px] w-[calc(100%+2px)] -translate-x-1/2 overflow-y-auto rounded-b-[5px] border border-borderColor-light bg-white px-[10px] py-[7px] text-content-light shadow-md transition-all duration-200 ease-out dark:border-borderColor-dark dark:bg-transparent ${className}`}
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