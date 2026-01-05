import { z } from "zod";

export const createMerchantMidSchema = (t: any) => {
  return z.object({
    merchantId: z.string().min(1, t("validation.merchantRequired")),
    mid: z.string().min(1, t("validation.midRequired")),
    brand: z.string().min(1, t("validation.brandRequired")),
    status: z.enum(["active", "inactive"]),
    effectiveStartDate: z
      .string()
      .min(1, t("validation.effectiveStartDateRequired")),
    effectiveEndDate: z
      .string()
      .min(1, t("validation.effectiveEndDateRequired")),
  });
};
