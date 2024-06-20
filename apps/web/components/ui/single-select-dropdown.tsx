import React from "react";
import type { LucideIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface option {
  id: number;
  name: string;
  value: string | number;
  icon?: LucideIcon;
}

interface SingleSelectDropdownProps {
  triggerClassName?: string;
  contentClassName?: string;
  placeholder?: string;
  setOptions: Function;
  options: option[];
  defaultValue?: option;
}

export const SingleSelectDropdown = ({
  triggerClassName,
  contentClassName,
  placeholder,
  setOptions,
  options,
  defaultValue,
}: SingleSelectDropdownProps) => {
  return (
    <React.StrictMode>
      <Select
        defaultValue={defaultValue ? String(defaultValue?.value) : undefined}
        onValueChange={(value) => setOptions(value)}
      >
        <SelectTrigger className={triggerClassName}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={contentClassName}>
          {options.map((option) => {
            return (
              <SelectItem value={String(option.value)} key={option.id}>
                <div className="flex items-center space-x-4">
                  {option.icon && <option.icon size={16} />}
                  <p className="text-sm font-medium leading-none">{option.name}</p>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </React.StrictMode>
  );
};
