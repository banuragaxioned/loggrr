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

export function debounce(func: (...args: any[]) => void, delay: number) {
  let timeoutId: NodeJS.Timeout;

  return function (...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export function findDifferenceBetweenTwoArray(bigArray: any[], smallArray: any[]){
  return bigArray.filter(obj1 => !smallArray.some(obj2 => obj1.id === obj2.id))
}