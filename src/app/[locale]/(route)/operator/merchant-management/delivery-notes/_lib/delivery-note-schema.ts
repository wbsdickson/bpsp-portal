import { z } from "zod";

const deliveryNoteItemSchema = (t: any) =>
  z.object({
    itemId: z.string().min(1, { message: t("validation.itemRequired") }),
    description: z.string().optional(),
    quantity: z.number().min(1, { message: t("validation.quantityRequired") }),
    unitPrice: z.number().min(0, { message: t("validation.unitPriceRequired") }),
    taxId: z.string().optional(),
  });

export const createDeliveryNoteSchema = (t: any) =>
  z.object({
    deliveryNoteNumber: z
      .string()
      .min(1, { message: t("validation.required") }),
    clientId: z.string().min(1, { message: t("validation.required") }),
    status: z.enum(["draft", "issued"]),
    deliveryDate: z.string().min(1, { message: t("validation.required") }),
    amount: z.number().min(0, { message: t("validation.min", { min: 0 }) }),
    items: z
      .array(deliveryNoteItemSchema(t))
      .min(1, { message: t("validation.minItems") }),
  });
