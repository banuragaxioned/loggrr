"use client";

import { useEffect, useState } from "react";

interface CategoryBarProps {
  values?: number[];
  markerValue: number;
  title: string;
  subtitle: string;
  maxValue: number;
  type?: "hours";
}

const SCALE_LABELS = [0, 25, 50, 75, 100];

/** Sample the rose → amber → emerald track at a 0–100 position. */
function colorAtPercent(percent: number): string {
  const stops: Array<{ at: number; color: [number, number, number] }> = [
    { at: 0, color: [251, 113, 133] }, // rose-400
    { at: 50, color: [252, 211, 77] }, // amber-300
    { at: 100, color: [16, 185, 129] }, // emerald-500
  ];

  const t = Math.min(Math.max(percent, 0), 100);
  let left = stops[0];
  let right = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i].at && t <= stops[i + 1].at) {
      left = stops[i];
      right = stops[i + 1];
      break;
    }
  }

  const span = right.at - left.at || 1;
  const mix = (t - left.at) / span;
  const rgb = left.color.map((channel, i) => Math.round(channel + (right.color[i] - channel) * mix));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

export default function CategoryDataBar({ markerValue, maxValue, title, subtitle, type }: CategoryBarProps) {
  const targetPercent = maxValue > 0 ? Math.min(Math.max((markerValue / maxValue) * 100, 0), 100) : 0;
  // Defer so the CSS transition runs when the value changes (and on mount).
  const [percent, setPercent] = useState(0);
  const unit = type === "hours" ? "h" : "";
  const markerColor = colorAtPercent(percent);

  useEffect(() => {
    const id = requestAnimationFrame(() => setPercent(targetPercent));
    return () => cancelAnimationFrame(id);
  }, [targetPercent]);

  return (
    <section className="border-border bg-card rounded-2xl border p-4">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-sm font-medium">{title}</h2>
          <p className="text-muted-foreground text-[11px]">{subtitle}</p>
        </div>
        <p className="pt-0.5 text-right tabular-nums">
          <span className="text-foreground text-lg font-semibold">{markerValue}</span>
          <span className="text-muted-foreground text-sm">
            /{maxValue}
            {unit ? ` ${unit}` : ""}
          </span>
        </p>
      </div>

      <div className="space-y-2">
        <div className="text-muted-foreground flex justify-between px-0.5 text-[10px] tabular-nums">
          {SCALE_LABELS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="relative h-4">
          <div
            className="absolute inset-x-0 inset-y-[5px] rounded-full bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-500 dark:from-rose-600 dark:via-amber-500 dark:to-emerald-600"
            role="presentation"
          />

          {/* Dot marker — fill matches the track color at this value */}
          <div
            className="border-background absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-[left,background-color] duration-500 ease-out"
            style={{ left: `${percent}%`, backgroundColor: markerColor }}
            title={`${markerValue}${unit} of ${maxValue}${unit}`}
            aria-hidden
          />
        </div>

        <span className="sr-only">
          {markerValue}
          {unit} of {maxValue}
          {unit} logged ({Math.round(targetPercent)}%)
        </span>
      </div>
    </section>
  );
}
