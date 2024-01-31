import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isSuperAdmin = (session: any) => {
  return session.user.email === "joeshajan@outlook.coms";
};
