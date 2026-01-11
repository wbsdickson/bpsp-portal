'use server';

import { emailSchema, registerSchema, type EmailFormValues, type RegisterFormValues } from './schemas';

export async function sendConfirmationEmail(data: EmailFormValues) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const validation = emailSchema.safeParse(data);
  if (!validation.success) {
    throw new Error("Invalid input");
  }

  if (data.email === "error@example.com") {
    throw new Error("Email already registered");
  }

  return { success: true, message: "A confirmation URL has been sent to the email address you provided." };
}

export async function verifyToken(token: string) {
   await new Promise((resolve) => setTimeout(resolve, 500));

   if (token === "invalid") {
     return { valid: false };
   }

   return { valid: true };
}

export async function completeRegistration(data: RegisterFormValues, token: string) {
  await new Promise((resolve) => setTimeout(resolve, 1500));

   const validation = registerSchema.safeParse(data);
  if (!validation.success) {
    throw new Error("Invalid input");
  }

  return { success: true };
}
