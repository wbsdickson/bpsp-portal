import { z } from "zod";

export const createLineItemSchema = (t: any) =>
  z.object({
    itemId: z.string().optional(),
    description: z.string().optional(),
    quantity: z.number().min(1, t("validation.quantityMin")),
    unitPrice: z.number().min(0, t("validation.unitPriceMin")),
    taxId: z.string().optional(),
  });

export const createMerchantInvoiceSchema = (t: any) => {
  return z.object({
    merchantId: z.string().min(1, t("validation.merchantRequired")),
    clientId: z.string().min(1, t("validation.clientRequired")),
    invoiceDate: z.string().min(1, t("validation.dateRequired")),
    dueDate: z.string().optional(),
    amount: z.number().min(0),
    currency: z.string().min(1),
    updatedAt: z.string().optional(),
    invoiceNumber: z.string().min(1, t("validation.numberRequired")),
    status: z.enum([
      "draft",
      "pending",
      "approved",
      "paid",
      "rejected",
      "void",
    ]),
    items: z
      .array(createLineItemSchema(t))
      .min(1, t("validation.itemsRequired")),
    remark: z.string().optional(),
  });
};
