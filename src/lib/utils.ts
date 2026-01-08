import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uuid(prefix: string = ""): string {
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${crypto.randomUUID()}`;
}

export function getAppOrigin(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL ?? "";
}

export function absoluteUrl(pathname: string): string {
  const origin = getAppOrigin();
  if (!origin) return pathname;
  if (pathname.startsWith("http://") || pathname.startsWith("https://")) {
    return pathname;
  }
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${origin}${normalizedPath}`;
}

export function generateId(prefix: string = ""): string {
  // 19-digit numeric string (first digit 1-9 to keep it 19 digits)
  const digits: number[] = [];

  if (
    typeof globalThis.crypto !== "undefined" &&
    "getRandomValues" in globalThis.crypto
  ) {
    const bytes = new Uint8Array(19);
    globalThis.crypto.getRandomValues(bytes);
    digits.push((bytes[0] % 9) + 1);
    for (let i = 1; i < 19; i++) digits.push(bytes[i] % 10);
  } else {
    digits.push(Math.floor(Math.random() * 9) + 1);
    for (let i = 1; i < 19; i++) digits.push(Math.floor(Math.random() * 10));
  }

  const suffix = digits.join("");
  return prefix ? `${prefix}_${suffix}` : suffix;
}

export const toCapitalized = (str: string) =>
  str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
