import { Button } from "@/components/ui/button";

import { ChevronsUpDown, ChevronDown, ChevronUp } from "lucide-react";

export const ColumnControls = ({ children, setSortingType, sortingType, id, index }: any) => {
  return (
    <Button
      onClick={() =>
        setSortingType({
          key: sortingType.active === index ? (sortingType.key === 0 ? 1 : sortingType.key > 0 ? -1 : 0) : 1,
          id: id,
          active: index,
        })
      }
      className={`bg group gap-x-1 border-none px-0 py-0 hover:bg-transparent ${
        sortingType > 0 ? "text-black" : "text-slate-500"
      }`}
    >
      {children}
      {sortingType.key === 0 || sortingType.active !== index ? (
        <ChevronsUpDown className="invisible h-4 w-4 group-hover:visible" />
      ) : sortingType.key > 0 ? (
        <ChevronUp className="invisible h-4 w-4 group-hover:visible" />
      ) : (
        <ChevronDown className="invisible h-4 w-4 group-hover:visible" />
      )}
    </Button>
  );
};
