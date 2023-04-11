// Source: https://ui.shadcn.com/docs/installation#add-a-cn-helper

import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get initials from name
export function getInitials(name: string): string {
  const initials = name
    .match(/(^\S\S?|\s\S)?/g)
    ?.map((v) => v.trim())
    .join("")
    .match(/(^\S|\S$)?/g)
    ?.join("")
    .toLocaleUpperCase();

  return initials ?? "";
}

/**
 * This function converts a time string in the format of HH:mm or HH.mm to minutes
 * getTimeInMinutes('0') // Output: 0
 * getTimeInMinutes('0.5') // Output: 30
 * getTimeInMinutes('0:50') // Output: 50
 * getTimeInMinutes('1.75') // Output: 105
 * getTimeInMinutes('1:30') // Output: 90
 * getTimeInMinutes('1.5') // Output: 90
 * getTimeInMinutes('2.25') // Output: 135
 * getTimeInMinutes('12:00') // Output: 720
 * getTimeInMinutes('7.5') // Output: 450
 * getTimeInMinutes('7:30') // Output: 450
 * thigetTimeInMinutes('3') // Output: 180 TODO: this edge case doesn't work yet
 */

export const getTimeInMinutes = (logTime: string): number => {
  try {
    const isHourMinFormat = logTime.includes(":") || /^\d+$/.test(logTime);
    const timeArr = isHourMinFormat ? logTime.split(":") : logTime.split(".");

    if (timeArr.length !== 2 || isNaN(Number(timeArr[0])) || isNaN(Number(timeArr[1]))) {
      // Invalid time format
      throw new Error("Invalid time format. Please use the format HH:mm or H.mm");
    }

    const timeFormat = isHourMinFormat ? "HOURMIN" : "HOURS";
    let logTimeInMinutes;

    if (timeFormat === "HOURMIN") {
      const hours = parseInt(timeArr[0] || "0", 10);
      const minutes = parseInt(timeArr[1] || "0", 10);
      logTimeInMinutes = hours * 60 + minutes;
    } else {
      const hours = parseInt(timeArr[0] || "0", 10);
      const minutes = parseInt(timeArr[1] || "0", 10);
      const decimalPlaces = timeArr[1].length;
      const decimalFraction = minutes / 10 ** decimalPlaces;
      logTimeInMinutes = hours * 60 + decimalFraction * 60;
    }

    return Math.round(logTimeInMinutes);
  } catch (error) {
    throw new Error("Invalid time format. Please use the format HH:mm or H.mm");
  }
};

// Get time in hours and minutes
export const getTimeInHours = (duration: number) => {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  const HH = hours < 10 ? `0${hours}` : hours;
  const MM = minutes < 10 ? `0${minutes}` : minutes;
  return `${HH}:${MM}`;
};

// Get date with Date format, but with 00:00:00 time
export const cleanDate = (dateInput: Date) => {
  const justDate = dateInput.toISOString().split("T")[0];
  return new Date(justDate);
};

export function absoluteUrl(path: string) {
  return `${process.env.NEXTAUTH_URL}${path}`
}
