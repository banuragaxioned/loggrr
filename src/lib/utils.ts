// Source: https://ui.shadcn.com/docs/installation#add-a-cn-helper

import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function removeDuplicatesFromArray(array: []) {
  const finalArray: string[] = [];
  const obj: any = {};

  for (const value of array) {
    if (!obj[value]) {
      obj[value] = true;
      finalArray.push(value);
    }
  }

  return finalArray;
}
