"use client";

import { useTheme } from "next-themes";

import { Laptop, Loader, Moon, SunMedium } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Loader className="rotate-0 scale-100 transition-all hover:text-zinc-950 dark:rotate-0 dark:scale-100 dark:text-zinc-400 dark:hover:text-zinc-100" />
      </Button>
    );
  }

  const handleToggle = () => {
    if (theme === "light") {
      setTheme("dark");
    }
    if (theme === "dark") {
      setTheme("system");
    }
    if (theme === "system") {
      setTheme("light");
    }
  };

  return (
    <Button variant="outline" size="icon" onClick={handleToggle} className={className}>
      {theme === "system" ? (
        <Laptop className="rotate-0 scale-100 transition-all hover:text-zinc-950 dark:rotate-0 dark:scale-100 dark:text-zinc-400 dark:hover:text-zinc-100" />
      ) : (
        <>
          <SunMedium className="rotate-0 scale-100 transition-all hover:text-zinc-950 dark:-rotate-90 dark:scale-0 dark:text-zinc-400 dark:hover:text-zinc-100" />
          <Moon className="absolute rotate-90 scale-0 transition-all hover:text-zinc-950 dark:rotate-0 dark:scale-100 dark:text-zinc-400 dark:hover:text-zinc-100" />
        </>
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
