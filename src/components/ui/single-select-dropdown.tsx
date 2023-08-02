import React from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SingleSelectDropdownProps {
  triggerClassName: string;
  contentClassName: string;
  placeholder: string;
  selectionHandler: Function;
  selectionOptions: {
    title: string;
    value: string;
  }[];
}

export const SingleSelectDropdown = ({
  triggerClassName,
  contentClassName,
  placeholder,
  selectionHandler,
  selectionOptions,
}: SingleSelectDropdownProps) => {
  return (
    <React.StrictMode>
      <Select onValueChange={(value) => selectionHandler(value)}>
        <SelectTrigger className={triggerClassName}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={contentClassName}>
          {selectionOptions.map((option, i) => {
            return (
              <SelectItem value={option.value} key={i}>
                {option.title}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </React.StrictMode>
  );
};
