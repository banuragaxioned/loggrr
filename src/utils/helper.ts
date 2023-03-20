// Source: https://ui.shadcn.com/docs/installation#add-a-cn-helper

import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  const initials = name
    .match(/(^\S\S?|\s\S)?/g)
    ?.map((v) => v.trim())
    .join('')
    .match(/(^\S|\S$)?/g)
    ?.join('')
    .toLocaleUpperCase();

  return initials ?? '';
}
