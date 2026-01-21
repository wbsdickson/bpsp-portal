import { z } from "zod";

export const createUserSchema = (t: any) => {
  return z.object({
    name: z.string().min(1, t("validation.nameRequired")),
    email: z
      .string()
      .min(1, t("validation.emailRequired"))
      .email(t("validation.emailInvalid")),
    role: z.enum([
      "backoffice_admin",
      "backoffice_staff",
      "merchant_owner",
      "merchant_admin",
      "merchant_viewer",
    ]),
    password: z.string().optional().or(z.literal("")),
  });
};
