import { z } from "zod";

export const createQuotationLineItemSchema = (t: any) =>
  z.object({
    itemId: z.string().optional(),
    description: z.string().optional(),
    quantity: z.number().min(1, t("validation.quantityMin")),
    unitPrice: z.number().min(0, t("validation.unitPriceMin")),
    taxId: z.string().optional(),
  });

export const createMerchantQuotationSchema = (t: any) => {
  return z.object({
    clientId: z.string().min(1, t("validation.clientRequired")),
    quotationDate: z.string().min(1, t("validation.issueDateRequired")),
    amount: z.number(),
    items: z
      .array(createQuotationLineItemSchema(t))
      .min(1, t("validation.itemsRequired")),
    notes: z.string().optional(),
  });
};
