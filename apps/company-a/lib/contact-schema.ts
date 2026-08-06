import { z } from "zod";

/**
 * Shared validation for the contact form (client + server). The subject enum
 * must match the `value`s in content/contact.ts → inquiryTypes.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .max(30, "That phone number looks too long.")
    .optional()
    .or(z.literal("")),
  subject: z.enum([
    "partnership",
    "investment",
    "corporate-services",
    "careers",
    "general",
  ]),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more, at least 10 characters.")
    .max(4000, "That message is too long."),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactFieldErrors = Partial<Record<keyof ContactInput, string[]>>;
