import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getJWTToken() {
  const JWTToken: string | null | undefined = localStorage.getItem("JWTToken");

  if (JWTToken === null || JWTToken === undefined) {
    return null;
  }
  return JWTToken;
}
