import { z } from 'zod';

export const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const registerSchema = z.object({
  merchantName: z.string().min(1, "Merchant Name is required"),
  ownerName: z.string().min(1, "Owner Name is required"),
  phoneNumber: z.string().min(1, "Phone Number is required"),
  address: z.string().min(1, "Address is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type EmailFormValues = z.infer<typeof emailSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
