"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";

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
  const selectedRange = searchParams.get("range") ?? "";
  const selectedProject = searchParams.get("project") ?? "";
  const selectedClients = searchParams.get("clients") ?? "";
  const selectedMembers = searchParams.get("members") ?? "";
  const selectedBilling = searchParams.get("billable");
  const [open, setOpen] = useState(false);
  const isFilterOf = values.title.toLowerCase();

  const renderTitle = () => {
    const labelToDisplay = values.options?.find(
      (value) => value.link === (isFilterOf === "month" ? null : selectedProject),
    )?.title;

    if (isFilterOf === "projects" && labelToDisplay && selectedProject) {
      return labelToDisplay;
    }

    return values.options?.[0].title ?? values.title;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="w-min">
        <Button variant="outline" role="combobox" className="justify-between gap-1.5" size="sm">
          {values.icon}
          {renderTitle()}
        </Button>
      </PopoverTrigger>
      {Array.isArray(values.options) && (
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
                      range: selectedRange ?? "",
                      project: isFilterOf === "projects" ? option.link : selectedProject,
                      clients: selectedClients ?? "",
                      members: selectedMembers ?? "",
                      billable: selectedBilling ?? "",
                    })}`}
                    className="flex w-full items-center justify-between px-3 py-1.5"
                  >
                    {option.title}
                    <Check size={16} className={selectedProject === option.link ? "opacity-100" : "opacity-0"} />
                  </Link>
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
};

export default DropdownFilter;
