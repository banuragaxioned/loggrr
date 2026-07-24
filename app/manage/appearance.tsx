"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Check, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useColorTheme } from "@/app/color-theme-provider";
import { cn } from "@/lib/utils";

export function Appearance() {
  const { theme: mode, setTheme: setMode } = useTheme();
  const { theme: colorTheme, setTheme: setColorTheme, themes } = useColorTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="mt-1 space-y-8">
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-medium">Mode</h3>
          <p className="text-muted-foreground text-sm">Switch between light and dark appearance.</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className={cn("flex w-32 items-center gap-2", mode === "light" && "border-primary ring-ring ring-1")}
            onClick={() => setMode("light")}
          >
            <Sun size={16} />
            Light
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={cn("flex w-32 items-center gap-2", mode === "dark" && "border-primary ring-ring ring-1")}
            onClick={() => setMode("dark")}
          >
            <Moon size={16} />
            Dark
          </Button>
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-medium">Color theme</h3>
          <p className="text-muted-foreground text-sm">
            Choose a palette. Zinc is the original neutral look. Works with both light and dark mode.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {themes.map((item) => {
            const isActive = colorTheme === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setColorTheme(item.id)}
                aria-pressed={isActive}
                className={cn(
                  "border-border bg-card hover:border-primary/40 relative flex flex-col gap-2.5 rounded-lg border p-3 text-left transition-colors",
                  isActive && "border-primary ring-ring ring-1",
                )}
              >
                {isActive && (
                  <span className="bg-primary text-primary-foreground absolute top-2 right-2 flex size-5 items-center justify-center rounded-full">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
                <div
                  className="border-border h-12 w-full overflow-hidden rounded-md border"
                  style={{
                    background: `linear-gradient(135deg, ${item.swatches[3]} 0%, ${item.swatches[2]} 45%, ${item.swatches[1]} 75%, ${item.swatches[0]} 100%)`,
                  }}
                />
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="flex gap-0.5">
                      {item.swatches.slice(0, 3).map((swatch) => (
                        <span
                          key={swatch}
                          className="border-border size-2.5 rounded-full border"
                          style={{ backgroundColor: swatch }}
                        />
                      ))}
                    </span>
                  </div>
                  <p className="text-muted-foreground line-clamp-2 text-[11px] leading-snug">{item.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
