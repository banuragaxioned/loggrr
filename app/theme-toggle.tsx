"use client";

import { useTheme } from "next-themes";

import { Moon, SunMedium } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme();

  const handleToggle = () => {
    if (theme === "light") {
      setTheme("dark");
    }
    if (theme === "dark") {
      setTheme("light");
    }
  };

  return (
    <Button size="icon" variant="outline" aria-label="Toggle theme" onClick={handleToggle} className={className}>
      <SunMedium className="rotate-0 scale-100 transition-all hover:text-zinc-950 dark:-rotate-90 dark:scale-0 dark:text-zinc-400 dark:hover:text-zinc-100" />
      <Moon className="absolute rotate-90 scale-0 transition-all hover:text-zinc-950 dark:rotate-0 dark:scale-100 dark:text-zinc-400 dark:hover:text-zinc-100" />
    </Button>
  );
}
