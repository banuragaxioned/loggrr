"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarNavItem } from "@/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SecondaryNavProps {
  items: SidebarNavItem[];
}

export function SecondaryNavigation({ items }: SecondaryNavProps) {
  const pathname = usePathname();

  return (
    <Tabs defaultValue={pathname} key={pathname} className="px-2">
      <TabsList className="w-full">
        {items.map((link) => (
          <Link href={link.href!} className="w-full" key={link.href}>
            <TabsTrigger value={link.href!} className="flex gap-1.5">
              {link.icon}
              {link.title}
            </TabsTrigger>
          </Link>
        ))}
      </TabsList>
    </Tabs>
  );
}
