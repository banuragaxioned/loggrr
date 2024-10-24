import React from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { roles } from "@/config/filters";

const RoleDropdown = ({
  userRole,
  id,
  name,
  updateStatus,
}: {
  userRole: string;
  id: number;
  name?: string;
  updateStatus: (id: number, role: string, name?: string, userRole?: string) => void;
}) => {
  const ROLES = roles;
  const icon = ROLES.find((role) => role.value === userRole);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" className="h-8 text-xs" title="Update role" variant="outline">
          <div className="flex gap-2">
            {icon && <icon.icon size={14} className="text-muted-foreground" />}
            {userRole}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0 text-sm" align="start">
        <PopoverClose asChild>
          <Command>
            <CommandInput placeholder="Search role..." />
            <CommandList>
              <CommandEmpty>No role found.</CommandEmpty>
              <CommandGroup>
                {ROLES.map((role) => {
                  return (
                    <CommandItem
                      key={role.label}
                      className="flex cursor-pointer items-center justify-between"
                      onSelect={() => {
                        updateStatus(id, role.value, name, userRole);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {<role.icon size={14} className="text-muted-foreground" />}
                        {role.label}
                      </div>
                      <Check className={cn("mr-2 h-4 w-4", userRole === role.value ? "opacity-100" : "opacity-0")} />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
};

export default RoleDropdown;
