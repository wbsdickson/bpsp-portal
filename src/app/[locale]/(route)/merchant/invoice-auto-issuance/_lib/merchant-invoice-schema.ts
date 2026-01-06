import { z } from "zod";

export const createLineItemSchema = (t: any) =>
  z.object({
    itemId: z.string().optional(),
    description: z.string().optional(),
    quantity: z.number().min(1, t("validation.quantityMin")),
    unitPrice: z.number().min(0, t("validation.unitPriceMin")),
    taxId: z.string().optional(),
  });

export const createInvoiceAutoIssuanceSchema = (t: any) => {
  return z.object({
    merchantId: z.string().min(1, t("validation.merchantRequired")),
    targetClient: z.string().min(1, t("validation.targetClientRequired")),
    issuanceFrequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
    intervalValue: z.number().min(1),
    scheduleName: z.string().min(1, t("validation.scheduleNameRequired")),
    nextIssuanceDate: z.string().min(1),
    enabled: z.boolean().catch(false),
  });
};
