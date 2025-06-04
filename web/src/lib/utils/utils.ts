import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatNumeric(input: string | number): string {
    const cleaned = input.toString().replace(/[^0-9.-]/g, "");

    const number = parseFloat(cleaned);
    if (isNaN(number)) return "0";

    return number.toLocaleString();
}

export function typedEntries<T extends object>(
    obj: T,
): [keyof T, T[keyof T]][] {
    return Object.entries(obj) as [keyof T, T[keyof T]][];
}

export function convertToCamelCase (text: string) {
    return text.replace(/([a-z0-9])_([a-z0-9])/gi, (match, p1, p2) => `${p1}${p2.toUpperCase()}`);
}
