"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppearanceForm() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    mounted && (
      <div className="space-y-6">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className={cn("flex w-32 items-center gap-2", theme === "light" && "border-success")}
            onClick={() => setTheme("light")}
          >
            <Sun size={18} />
            Light
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={cn("flex w-32 items-center gap-2", theme === "dark" && "border-success")}
            onClick={() => setTheme("dark")}
          >
            <Moon size={18} />
            Dark
          </Button>
        </div>
      </div>
    )
  );
}