import React from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Role } from "@prisma/client";

const ROLES = Role;

const RoleDropdown = ({
  userRole,
  id,
  name,
  updateStatus,
}: {
  userRole: string;
  id: number;
  name?: string;
  updateStatus: (id: number, role: string, name?: string) => void;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" className="h-8 text-xs" title="Update role" variant="outline">
          {userRole}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0 text-sm" align="start">
        <PopoverClose asChild>
          <Command>
            <CommandInput placeholder="Search role..." />
            <CommandList>
              <CommandEmpty>No role found.</CommandEmpty>
              <CommandGroup>
                {Object.values(ROLES).map((role) => (
                  <CommandItem
                    key={role}
                    className="flex cursor-pointer items-center justify-between capitalize"
                    onSelect={(currentValue) => {
                      updateStatus(id, currentValue, name);
                    }}
                  >
                    {role.toLowerCase()}
                    <Check className={cn("mr-2 h-4 w-4", userRole === role ? "opacity-100" : "opacity-0")} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
};

export default RoleDropdown;
