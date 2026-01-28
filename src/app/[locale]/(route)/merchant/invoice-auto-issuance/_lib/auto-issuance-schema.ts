import { z } from "zod";

export const autoIssuanceSchema = z.object({
  id: z.string(),
  merchantId: z.string(),
  targetClient: z.string(),
  scheduleName: z.string(),
  issuanceFrequency: z.string(),
  intervalValue: z.number(),
  nextIssuanceDate: z.string(),
  enabled: z.boolean(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const autoIssuancesResponseSchema = z.object({
  data: z.array(autoIssuanceSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export const autoIssuanceResponseSchema = z.object({
  data: autoIssuanceSchema,
});
