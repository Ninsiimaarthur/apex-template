import { z } from "zod";

/** Shared by the contact form (client) and /api/contact (server). */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone / WhatsApp number")
    .max(20, "That number looks too long")
    .regex(/^[+\d\s()-]+$/, "Use digits, spaces, + or - only"),
  // Optional: many local customers prefer phone / WhatsApp.
  email: z
    .string()
    .trim()
    .max(254)
    .refine((v) => v === "" || z.string().email().safeParse(v).success, "Enter a valid email address"),
  service: z.string().trim().min(1, "Please choose a service").max(100),
  message: z.string().trim().min(10, "Please add a few details (at least 10 characters)").max(2000),
  // Honeypot: real users never see or fill this field.
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
