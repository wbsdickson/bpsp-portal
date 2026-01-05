import { z } from "zod";

const TAX_CATEGORY_OPTIONS = ["taxable", "non_taxable"] as const;
const STATUS_OPTIONS = ["active", "inactive"] as const;

export const createMerchantItemSchema = (t: any) => {
  return z.object({
    name: z.string().min(1, t("validation.nameRequired")),
    unitPrice: z
      .string()
      .min(1, t("validation.unitPriceRequired"))
      .refine(
        (v) => Number.isFinite(Number(v)),
        t("validation.unitPriceInvalid"),
      ),
    taxCategory: z.enum(TAX_CATEGORY_OPTIONS),
    description: z.string(),
    status: z.enum(STATUS_OPTIONS),
  });
};
