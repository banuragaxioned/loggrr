"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { SidebarNavItem } from "@/types";

interface SecondaryNavProps {
  items: SidebarNavItem[];
}

export function SecondaryNavigation({ items }: SecondaryNavProps) {
  const path = usePathname();

  return (
    <ScrollArea className="max-w-[600px] lg:max-w-none">
      <div className={cn("mb-4 flex items-center gap-2")}>
        {items.map((link) => (
          <Link
            href={link.href!}
            key={link.href}
            className={cn(
              "flex h-8 items-center justify-center gap-2 rounded-full border px-4 text-center text-sm transition-colors hover:bg-primary hover:text-gray-300 dark:hover:bg-primary-foreground",
              path == link.href
                ? "bg-primary text-muted hover:text-white dark:text-background dark:hover:bg-primary dark:hover:text-background"
                : "text-muted-foreground",
            )}
          >
            {link.icon}
            {link.title}
          </Link>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  );
}
