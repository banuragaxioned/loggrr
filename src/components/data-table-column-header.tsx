import { Column } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

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
        className="h-8 px-0 data-[state=open]:bg-accent"
        onClick={() => clickHandler(column)}
      >
        {title && <span className="p-3">{title}</span>}
        {child}
        {column.getIsSorted() === "desc" ? (
          <Icons.selectDown className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "asc" ? (
          <Icons.selectUp className="ml-2 h-4 w-4" />
        ) : (
          <Icons.select className="ml-2 h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
