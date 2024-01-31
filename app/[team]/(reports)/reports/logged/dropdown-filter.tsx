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
  icon: React.ReactNode;
  options: {
    id: number;
    title: string;
    link: string;
  }[];
}

const DropdownFilter = ({ values }: { values: LoggedInterface }) => {
  const searchParams = useSearchParams();
  const selectedMonth = searchParams.get("month") ?? "";
  const selectedProject = searchParams.get("project") ?? "";
  const selectedClients = searchParams.get("clients") ?? "";
  const selectedPeoples = searchParams.get("peoples") ?? "";
  const selectedBilling = searchParams.get("billable");
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
        <Button variant="outline" role="combobox" className="justify-between gap-1.5" size="sm">
          {values.icon}
          {renderTitle()}
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
                    project: isFilterOf === "projects" ? option.link : selectedProject,
                    clients: selectedClients ?? "",
                    peoples: selectedPeoples ?? "",
                    billable: selectedBilling ?? "",
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

export default DropdownFilter;
