"use client"
import React from 'react';

interface MarkerBarProps {
  value: number;
  minValue: number;
  maxValue: number;
  color?: string;
  className?: string;
}

export function MarkerBar({ value, minValue, maxValue, className }: MarkerBarProps) {

  const getGreenBarWidth = () => {
    if (maxValue > value) return value + 2
    return maxValue
  }

  // Render the marker bar
  return (
    <div className={className}>
      <div className='bg-slate-200 rounded-md w-full h-2 overflow-hidden' />
      <div className='bg-[#f43f5e] absolute top-0 left-0 h-full rounded-md' style={{ width: `${maxValue}%` }} />
      <div className='bg-[#32ba80] absolute top-0 left-0 h-full rounded-md' style={{ width: `${getGreenBarWidth()}%` }} />
      <div className={`h-[20px] w-[6px] rounded-md bg-slate-400 border-white border-[1px] absolute -top-[5px]`} style={{ left: `${value}%` }} />
    </div>
  );
}