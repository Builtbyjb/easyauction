import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import api from "./api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function logOut() {
  localStorage.removeItem("ACCESS_TOKEN");
  localStorage.removeItem("REFRESH_TOKEN");
  window.location.assign("/login");
}

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("REFRESH_TOKEN");
  try {
    const response = await api.post("/api/token/refresh/", {
      refresh: refreshToken,
    });

    if (response.status === 200) {
      localStorage.setItem("ACCESS_TOKEN", response.data.access);
      return {
        access: response.data.access,
        value: true,
      };
    } else {
      return {
        access: null,
        value: false,
      };
    }
  } catch (error) {
    console.error("Refresh token expired", error);
    return {
      access: null,
      value: false,
    };
  }
};
