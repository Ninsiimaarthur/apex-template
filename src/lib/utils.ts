import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const telLink = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const whatsappLink = (number: string, message?: string) =>
  `https://wa.me/${number.replace(/\D/g, "")}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
