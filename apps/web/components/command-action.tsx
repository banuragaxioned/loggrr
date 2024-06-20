"use client";

import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { User, Moon, SunMedium, Boxes, Folder, Building2, BarChart2, BarChart3, Users, Group } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Role } from "@prisma/client";
import { Button } from "./ui/button";

interface CommandPropType {
  teams: {
    id: number;
    name: string;
    slug: string;
    role: Role;
  }[];
  slug?: string;
}

const MenuLinks = [
  { title: "Projects", href: "/projects", icon: Folder },
  { title: "Clients", href: "/clients", icon: Building2 },
  { title: "Workspace Members", href: "/members", icon: Users },
  { title: "Groups", href: "/groups", icon: Group },
  { title: "Reports - Logged", href: "/reports/logged", icon: BarChart2 },
];

export function CommandMenu(CommandProps: CommandPropType) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const { setTheme, theme } = useTheme();
  const workspaces = CommandProps.teams;

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        className="hidden text-sm text-muted-foreground lg:block"
        onClick={() => setOpen(true)}
      >
        Press{" "}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandSeparator />
          <CommandGroup heading="Navigation">
            {MenuLinks.map((link) => (
              <CommandItem
                key={link.title}
                onSelect={() => {
                  router.push(`/${CommandProps.slug}/${link.href}`);

                  setOpen(false);
                }}
              >
                <link.icon className="mr-2 h-4 w-4" />
                <span>{link.title}</span>
                <CommandShortcut>Page</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />
          {workspaces && (
            <>
              <CommandGroup heading="Workspaces">
                {workspaces.map((team) => (
                  <CommandItem
                    key={team.id}
                    onSelect={() => {
                      router.push(`/${team.slug}`);
                      setOpen(false);
                    }}
                  >
                    <Boxes className="mr-2 h-4 w-4" />
                    <span>{team.name}</span>
                    <CommandShortcut>Workspace</CommandShortcut>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}
          <CommandGroup heading="Settings">
            <CommandItem
              onSelect={() => {
                if (theme === "light") {
                  setTheme("dark");
                }
                if (theme === "dark") {
                  setTheme("light");
                }
              }}
            >
              <SunMedium
                size="16"
                className="mr-2 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 dark:text-zinc-400"
              />
              <Moon
                size="16"
                className="absolute mr-2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 dark:text-zinc-400"
              />
              <span>Switch Light/Dark color mode</span>
              <CommandShortcut>Action</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push("/manage");
                setOpen(false);
              }}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Manage Profile</span>
              <CommandShortcut>Page</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
