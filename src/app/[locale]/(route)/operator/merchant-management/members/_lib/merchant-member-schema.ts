import { z } from "zod";

export const createMerchantMemberSchema = (t: any) => {
  return z.object({
    merchantId: z.string().min(1, t("validation.merchantRequired")),
    name: z.string().min(1, t("validation.nameRequired")),
    email: z
      .string()
      .min(1, t("validation.emailRequired"))
      .email(t("validation.emailInvalid")),
    memberRole: z.enum(["owner", "staff", "viewer"]),
    status: z.enum(["active", "suspended"]),
    password: z.string().optional().or(z.literal("")),
  });
};
