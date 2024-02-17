import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isSuperAdmin = (session: any) => {
  console.log(session.user);

  return session.user.email === "joeshajan@outlook.com";
};
