"use client";

import React, { useState } from "react";

import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface LoggedInterface {
  title: string;
  searchable: boolean;
  options: {
    id: number;
    title: string;
    link: string;
  }[];
}

const DropdownFilters = ({ values }: { values: LoggedInterface }) => {
  const searcParams = useSearchParams();
  const selectedMonth = searcParams.get("month") ?? "";
  const selectedProject = searcParams.get("project") ?? "";
  const selectedBilling = searcParams.get("billable");
  const [open, setOpen] = useState(false);
  const isFilterOf = values.title.toLowerCase();

  const renderTitle = () => {
    const labelToDisplay = values.options.find(
      (value) => value.link === (isFilterOf === "month" ? selectedMonth : selectedProject),
    )?.title;

    if (isFilterOf === "month" && labelToDisplay && selectedMonth) {
      return labelToDisplay;
    }
    if (isFilterOf === "projects" && labelToDisplay && selectedProject) {
      return labelToDisplay;
    }

    return values.title;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        className={cn(
          "w-min",
          ((isFilterOf === "month" && selectedMonth) || (isFilterOf === "projects" && selectedProject)) &&
            "bg-indigo-100 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-500 dark:bg-indigo-600/20 dark:text-white dark:hover:bg-indigo-500/20",
        )}
      >
        <Button variant="outline" role="combobox" className="justify-between">
          {renderTitle()}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          {values.searchable && <CommandInput placeholder="Search..." />}
          <CommandEmpty>No options found.</CommandEmpty>
          <CommandList>
            {values.options.map((option) => (
              <CommandItem
                value={option.link || "all"}
                key={option.id}
                onSelect={() => {
                  setOpen(false);
                }}
                className="p-0"
              >
                <Link
                  href={`?${new URLSearchParams({
                    month: isFilterOf === "month" ? option.link : selectedMonth,
                    billable: selectedBilling ?? "",
                    project: isFilterOf === "projects" ? option.link : selectedProject,
                  })}`}
                  className="flex w-full items-center justify-between px-3 py-1.5"
                >
                  {option.title}
                  <Check
                    size={16}
                    className={
                      (isFilterOf === "month" ? selectedMonth : selectedProject) === option.link
                        ? "opacity-100"
                        : "opacity-0"
                    }
                  />
                </Link>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DropdownFilters;
