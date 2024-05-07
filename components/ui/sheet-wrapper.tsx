import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children?: React.ReactNode;
  button: string;
  title: string;
  description: string;
}

export function SheetWrapper({ children, button, title, description }: DashboardLayoutProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm">{button}</Button>
      </SheetTrigger>
      <SheetContent side="right" className="h-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="pt-4">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
