import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumeric(input: string | number): string {
  const cleaned = input.toString().replace(/[^0-9.-]/g, "");

  const number = parseFloat(cleaned);
  if (isNaN(number)) return "0";

  return number.toLocaleString();
}
