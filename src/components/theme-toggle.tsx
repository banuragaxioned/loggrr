"use client";

import { useTheme } from "next-themes";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="primary" size="sm" disabled>
        <Icons.spinner className="rotate-0 scale-100 transition-all hover:text-zinc-950 dark:rotate-0 dark:scale-100 dark:text-zinc-400 dark:hover:text-zinc-100" />
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
    <Button variant="primary" size="sm" onClick={handleToggle}>
      {theme === "system" ? (
        <Icons.laptop className="rotate-0 scale-100 transition-all hover:text-zinc-950 dark:rotate-0 dark:scale-100 dark:text-zinc-400 dark:hover:text-zinc-100" />
      ) : (
        <>
          <Icons.sun className="rotate-0 scale-100 transition-all hover:text-zinc-950 dark:-rotate-90 dark:scale-0 dark:text-zinc-400 dark:hover:text-zinc-100" />
          <Icons.moon className="absolute rotate-90 scale-0 transition-all hover:text-zinc-950 dark:rotate-0 dark:scale-100 dark:text-zinc-400 dark:hover:text-zinc-100" />
        </>
      )}

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
