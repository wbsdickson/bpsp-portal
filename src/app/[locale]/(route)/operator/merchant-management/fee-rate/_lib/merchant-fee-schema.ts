import { z } from "zod";

const numberString = (message: string) =>
  z
    .string()
    .min(1, message)
    .refine((v) => {
      const n = Number(v);
      return Number.isFinite(n);
    }, message);

export const createMerchantFeeSchema = (t: any) => {
  return z.object({
    merchantId: z.string().min(1, t("validation.merchantRequired")),
    cardBrand: z.string().min(1, t("validation.brandRequired")),
    paymentMethodType: z.enum(["card", "bank"]),
    mdrPercent: numberString(t("validation.mdrPercentMin"))
      .refine((v) => Number(v) >= 0, t("validation.mdrPercentMin"))
      .refine((v) => Number(v) <= 100, t("validation.mdrPercentMax")),
    fixedFee: numberString(t("validation.fixedFeeMin")).refine(
      (v) => Number(v) >= 0,
      t("validation.fixedFeeMin"),
    ),
    status: z.enum(["active", "suspended"]),
  });
};
