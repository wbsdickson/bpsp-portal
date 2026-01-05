import { z } from "zod";

export const createUserSchema = (t: any) => {
  return z.object({
    name: z.string().min(1, t("validation.nameRequired")),
    email: z
      .string()
      .min(1, t("validation.emailRequired"))
      .email(t("validation.emailInvalid")),
    role: z.enum(["merchant", "admin", "jpcc_admin", "merchant_jpcc"]),
    password: z.string().optional().or(z.literal("")),
  });
};
