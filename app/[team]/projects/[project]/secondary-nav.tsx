"use client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import Link from "next/link";
import { cn } from "../../../../lib/utils";
import { usePathname } from "next/navigation";
import { SidebarNavItem } from "../../../../types";

interface SecondaryNavProps {
  items: SidebarNavItem[];
}

export function SecondaryNavigation({ items }: SecondaryNavProps) {

  const path = usePathname();

  return (
    <ScrollArea className="max-w-[600px] lg:max-w-none">
      <div className={cn("mb-4 gap-2 flex items-center")}>
        {items.map((link) => (
          <Link
            href={link.href!}
            key={link.href}
            className={cn(
              "flex h-8 gap-2 border items-center justify-center rounded-full px-4 text-center text-sm transition-colors hover:text-primary",
              path == link.href ? "bg-muted text-primary" : "text-muted-foreground"
            )}
          >
            {link.icon}
            {link.title}
          </Link>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  )
}