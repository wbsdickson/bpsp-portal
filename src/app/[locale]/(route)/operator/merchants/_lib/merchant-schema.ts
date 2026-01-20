import { z } from "zod";

export const createMerchantSchema = (t: any) => {
  return z.object({
    name: z.string().min(1, t("validation.nameRequired")),
    address: z.string().optional(),
  });
};

export const merchantSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  invoiceEmail: z.string(),
  websiteUrl: z.string().optional(),
  invoicePrefix: z.string().optional(),
  enableCreditPayment: z.boolean().optional(),
  defaultTaxId: z.string().optional(),
  updatedBy: z.string().optional(),
  // AppMerchant extensions
  createdAt: z.string().optional(),
  status: z.enum(["active", "suspended"]).optional(),
  transactionCount: z.number().optional(),
});

export const merchantsResponseSchema = z.object({
  data: z.array(merchantSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export const merchantResponseSchema = z.object({
  data: merchantSchema,
});
