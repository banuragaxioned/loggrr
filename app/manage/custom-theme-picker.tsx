"use client";

import { useEffect, useMemo, useState } from "react";
import { Pipette, RotateCcw } from "lucide-react";

import { useColorTheme } from "@/app/color-theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateThemeFromPrimary, normalizeHex } from "@/lib/generate-theme";
import { cn } from "@/lib/utils";

const PRESET_SEEDS = ["#7C3AED", "#F31B7C", "#0284C7", "#059669", "#EA580C", "#E11D48", "#0D9488", "#D97706"];

export function CustomThemePicker() {
  const { theme, customConfig, setCustomConfig, resetCustomConfig } = useColorTheme();
  const [primaryDraft, setPrimaryDraft] = useState(customConfig.primary);
  const [accentDraft, setAccentDraft] = useState(customConfig.accent ?? "");
  const [useAccent, setUseAccent] = useState(Boolean(customConfig.accent));

  useEffect(() => {
    setPrimaryDraft(customConfig.primary);
    setAccentDraft(customConfig.accent ?? "");
    setUseAccent(Boolean(customConfig.accent));
  }, [customConfig]);

  const primaryHex = normalizeHex(primaryDraft) ?? customConfig.primary;
  const accentHex = useAccent ? normalizeHex(accentDraft) ?? undefined : undefined;
  const preview = useMemo(() => generateThemeFromPrimary(primaryHex, accentHex), [primaryHex, accentHex]);
  const isActive = theme === "custom";

  function apply(nextPrimary = primaryHex, nextAccent = accentHex) {
    setCustomConfig({
      primary: nextPrimary,
      ...(nextAccent ? { accent: nextAccent } : {}),
    });
  }

  function handlePrimaryColorInput(value: string) {
    setPrimaryDraft(value.toUpperCase());
    apply(value.toUpperCase(), accentHex);
  }

  function handleAccentColorInput(value: string) {
    setAccentDraft(value.toUpperCase());
    if (useAccent) apply(primaryHex, value.toUpperCase());
  }

  function handlePrimaryHexBlur() {
    const normalized = normalizeHex(primaryDraft);
    if (!normalized) {
      setPrimaryDraft(customConfig.primary);
      return;
    }
    setPrimaryDraft(normalized);
    apply(normalized, accentHex);
  }

  function handleAccentHexBlur() {
    if (!useAccent) return;
    const normalized = normalizeHex(accentDraft);
    if (!normalized) {
      setAccentDraft(customConfig.accent ?? "");
      return;
    }
    setAccentDraft(normalized);
    apply(primaryHex, normalized);
  }

  return (
    <section
      className={cn(
        "border-border bg-card space-y-4 rounded-lg border p-4",
        isActive && "border-primary ring-ring ring-1",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="flex items-center gap-2 text-sm font-medium">
            <Pipette size={16} />
            Custom theme
          </h3>
          <p className="text-muted-foreground text-sm">
            Pick a primary color (and optional accent). We generate light and dark tokens so you can experiment live.
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => resetCustomConfig()}>
            <RotateCcw size={14} />
            Reset
          </Button>
          <Button type="button" size="sm" variant={isActive ? "default" : "secondary"} onClick={() => apply()}>
            {isActive ? "Applied" : "Apply custom"}
          </Button>
        </div>
      </div>

      <div
        className="border-border h-16 w-full overflow-hidden rounded-md border"
        style={{
          background: `linear-gradient(135deg, ${preview.swatches[3]} 0%, ${preview.swatches[2]} 40%, ${preview.swatches[1]} 70%, ${preview.swatches[0]} 100%)`,
        }}
      />

      <div className="flex flex-wrap gap-1.5">
        {preview.swatches.map((swatch) => (
          <span
            key={swatch}
            className="border-border size-7 rounded-md border shadow-xs"
            style={{ backgroundColor: swatch }}
            title={swatch}
          />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="custom-primary">Primary</Label>
          <div className="flex items-center gap-2">
            <input
              id="custom-primary-swatch"
              type="color"
              value={primaryHex}
              onChange={(event) => handlePrimaryColorInput(event.target.value)}
              className="border-border h-9 w-12 cursor-pointer rounded-md border bg-transparent p-1"
              aria-label="Primary color picker"
            />
            <Input
              id="custom-primary"
              value={primaryDraft}
              onChange={(event) => setPrimaryDraft(event.target.value)}
              onBlur={handlePrimaryHexBlur}
              onKeyDown={(event) => {
                if (event.key === "Enter") handlePrimaryHexBlur();
              }}
              spellCheck={false}
              className="font-mono uppercase"
              placeholder="#7C3AED"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="custom-accent">Accent (optional)</Label>
            <label className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <input
                type="checkbox"
                checked={useAccent}
                onChange={(event) => {
                  const enabled = event.target.checked;
                  setUseAccent(enabled);
                  if (!enabled) {
                    apply(primaryHex, undefined);
                    setAccentDraft("");
                  } else {
                    const seed = normalizeHex(accentDraft) ?? primaryHex;
                    setAccentDraft(seed);
                    apply(primaryHex, seed);
                  }
                }}
              />
              Use accent
            </label>
          </div>
          <div className={cn("flex items-center gap-2", !useAccent && "opacity-50")}>
            <input
              id="custom-accent-swatch"
              type="color"
              value={normalizeHex(accentDraft) ?? primaryHex}
              disabled={!useAccent}
              onChange={(event) => handleAccentColorInput(event.target.value)}
              className="border-border h-9 w-12 cursor-pointer rounded-md border bg-transparent p-1 disabled:cursor-not-allowed"
              aria-label="Accent color picker"
            />
            <Input
              id="custom-accent"
              value={accentDraft}
              disabled={!useAccent}
              onChange={(event) => setAccentDraft(event.target.value)}
              onBlur={handleAccentHexBlur}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleAccentHexBlur();
              }}
              spellCheck={false}
              className="font-mono uppercase"
              placeholder="#F31B7C"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Quick seeds</p>
        <div className="flex flex-wrap gap-2">
          {PRESET_SEEDS.map((seed) => (
            <button
              key={seed}
              type="button"
              title={seed}
              onClick={() => {
                setPrimaryDraft(seed);
                apply(seed, accentHex);
              }}
              className={cn(
                "border-border size-8 rounded-full border transition-transform hover:scale-110",
                primaryHex === seed && "ring-ring ring-2 ring-offset-2 ring-offset-background",
              )}
              style={{ backgroundColor: seed }}
            />
          ))}
        </div>
      </div>

      <div className="bg-muted/60 grid grid-cols-2 gap-2 rounded-md p-3 sm:grid-cols-4">
        {[
          { label: "Primary", className: "bg-primary" },
          { label: "Accent", className: "bg-accent border border-border" },
          { label: "Muted", className: "bg-muted border border-border" },
          { label: "Card", className: "bg-card border border-border" },
        ].map((item) => (
          <div key={item.label} className="space-y-1.5">
            <div className={cn("h-8 rounded-md", item.className)} />
            <p className="text-muted-foreground text-[11px]">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
