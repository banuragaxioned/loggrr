import { Column } from "@tanstack/react-table";
import { cn } from "lib/utils";
import { Button } from "components/ui/button";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title?: string;
  child?: React.ReactNode;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  child,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const clickHandler = (column: Column<TData, TValue>) => {
    const sortingState = column.getIsSorted();
    !sortingState
      ? column.toggleSorting(false)
      : sortingState === "asc"
        ? column.toggleSorting(true)
        : column.clearSorting();
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-0 hover:bg-transparent data-[state=open]:bg-accent"
        onClick={() => clickHandler(column)}
      >
        {title && <span>{title}</span>}
        {child}
        {column.getIsSorted() === "desc" ? (
          <ChevronDown className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "asc" ? (
          <ChevronUp className="ml-2 h-4 w-4" />
        ) : (
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
