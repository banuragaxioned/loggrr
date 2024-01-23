"use client";

import { Assignment, DataTableToolbarProps } from "@/types";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus, Upload } from "lucide-react";

interface DataTableToolbarExtendedProps<Assignment> extends DataTableToolbarProps<Assignment> {}

const allDropdowns = [
  {
    id: 1,
    title: "Month",
    searchable: false,
    options: [
      { id: 1, title: "This Month" },
      { id: 2, title: "Previous Month" },
      { id: 3, title: "Last 3 Months" },
    ],
  },
  {
    id: 2,
    title: "Projects",
    searchable: false,
    options: [
      { id: 1, title: "My Projects" },
      { id: 2, title: "Active Projects" },
      { id: 3, title: "Client Projects" },
      { id: 4, title: "Archived Projects" },
    ],
  },
  {
    id: 3,
    title: "CFM +1 more",
    searchable: true,
    options: [
      { id: 1, title: "CFM" },
      { id: 2, title: "Axioned" },
      { id: 3, title: "XYZ" },
    ],
  },
  {
    id: 4,
    title: "Billable",
    searchable: false,
    options: [
      { id: 1, title: "Billable" },
      { id: 2, title: "Non-Billable" },
    ],
  },
];

const otherFilters = [
  {
    id: 1,
    title: "Client",
    options: [
      { id: 1, title: "CFM" },
      { id: 2, title: "ML Applied" },
      { id: 2, title: "Axioned" },
    ],
  },
  {
    id: 2,
    title: "People",
    options: [
      { id: 1, title: "CFM" },
      { id: 2, title: "ML Applied" },
      { id: 2, title: "Axioned" },
    ],
  },
];

export function DataTableToolbar<TData>({ table }: DataTableToolbarExtendedProps<Assignment>) {
  const selected = false; // Fake selected

  const renderDropdowns =
    Array.isArray(allDropdowns) &&
    allDropdowns.map((dropdown) => (
      <li key={dropdown.id}>
        <Popover>
          <PopoverTrigger
            asChild
            className={`w-min ${selected ? "bg-indigo-100 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-500 dark:bg-indigo-600/20 dark:text-white dark:hover:bg-indigo-500/20" : ""}`}
          >
            <Button variant="outline" role="combobox" className="justify-between">
              {dropdown.title}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
              {dropdown.searchable && <CommandInput placeholder="Search..." />}
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {dropdown.options.map((option) => (
                  <CommandItem key={option.id}>{option.title}</CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </li>
    ));

  return (
    <div className="mb-4 flex items-center justify-between gap-x-3 rounded-xl border border-dashed p-4">
      {/* <Input
        placeholder="Filter project..."
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
        className="max-w-sm"
      /> */}

      {/* Left Area */}
      <ul className="flex gap-2">
        {renderDropdowns}
        <li>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              {otherFilters.map((filter) => (
                <DropdownMenuSub key={filter.id}>
                  <DropdownMenuSubTrigger>{filter.title}</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Search..." autoFocus={true} />
                      <CommandList>
                        <CommandEmpty>No option found.</CommandEmpty>
                        <CommandGroup>
                          {filter.options.map((option) => (
                            <CommandItem key={option.id}>{option.title}</CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      </ul>
      {/* Right Area */}
      <div>
        <Button variant="outline" className="flex gap-2">
          <Upload size={16} />
          Export
        </Button>
      </div>
    </div>
  );
}
