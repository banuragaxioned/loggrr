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
      <div className="h-2 w-full overflow-hidden rounded-md bg-slate-200">
        <div
          className="absolute left-0 top-0 h-full max-w-full rounded-md bg-[#f43f5e]"
          style={{ width: `${maxValue}%` }}
        />
        <div
          className="absolute left-0 top-0 h-full max-w-full rounded-md bg-[#32ba80]"
          style={{ width: `${getGreenBarWidth()}%` }}
        />
      </div>
      <div
        className={`group absolute -top-[5px] h-[18px] w-[6px] rounded-md border-[1px] border-white bg-slate-400`}
        style={{ left: `${value}%` }}
      >
        <p className="invisible absolute -top-[34px] left-0 rounded-md border bg-background px-2.5 py-1 text-sm text-foreground group-hover:visible">{`${value}h`}</p>
      </div>
    </div>
  );
}
