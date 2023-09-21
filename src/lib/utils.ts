// Source: https://ui.shadcn.com/docs/installation#add-a-cn-helper

import { METHODS } from "@/types";
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

export async function serviceCall(path:string, method: METHODS, body: BodyInit | null | undefined) {
  return await fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T {
  let timeoutId: number;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay) as any; // Use `as any` to satisfy the type system
  } as T;
}
