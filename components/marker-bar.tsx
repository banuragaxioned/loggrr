"use client";
import React from "react";

interface MarkerBarProps {
  value: number;
  minValue: number;
  maxValue: number;
  color?: string;
  className?: string;
}

export function MarkerBar({ value, minValue, maxValue, className }: MarkerBarProps) {
  const getGreenBarWidth = () => {
    if (maxValue > value) return value + 2; // Added 2px to hide white space between marker and range color
    return maxValue;
  };

  // Render the marker bar
  return (
    <div className={className}>
      <div className="bg-muted h-2 w-full overflow-hidden rounded-md">
        <div
          className="bg-brand-fuchsia absolute top-0 left-0 h-full max-w-full rounded-md"
          style={{ width: `${maxValue}%` }}
        />
        <div
          className="bg-success absolute top-0 left-0 h-full max-w-full rounded-md"
          style={{ width: `${getGreenBarWidth()}%` }}
        />
      </div>
      <div
        className="border-background bg-muted-foreground group absolute top-[-5px] h-[18px] w-[6px] rounded-md border"
        style={{ left: `${value}%` }}
      >
        <p className="invisible absolute top-[-34px] left-0 rounded-md border bg-background px-2.5 py-1 text-sm text-foreground group-hover:visible">{`${value}h`}</p>
      </div>
    </div>
  );
}
