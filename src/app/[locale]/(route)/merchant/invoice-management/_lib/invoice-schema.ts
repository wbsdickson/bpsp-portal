import { z } from "zod";

export const invoiceItemSchema = z.object({
  id: z.string(),
  invoiceId: z.string(),
  itemId: z.string().optional(),
  name: z.string(),
  transactionDate: z.string().optional(),
  quantity: z.number(),
  unit: z.string().optional(),
  unitPrice: z.number(),
  taxId: z.string(),
  withholdingTax: z.boolean().optional(),
  amount: z.number(),
});

export const invoiceSchema = z.object({
  id: z.string(),
  merchantId: z.string(),
  clientId: z.string(),
  honorific: z.string().optional(),
  invoiceNumber: z.string(),
  invoiceDate: z.string(),
  dueDate: z.string().optional(),
  subject: z.string().optional(),
  direction: z.enum(["receivable", "payable"]),
  paymentMethod: z.string().optional(),
  status: z.enum([
    "draft",
    "pending",
    "approved",
    "paid",
    "rejected",
    "void",
    "past_due",
    "open",
  ]),
  amount: z.number(),
  currency: z.string(),
  notes: z.string().optional(),
  items: z.array(invoiceItemSchema),
  bankAccountId: z.string().optional(),
  remark: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().nullable().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
  fileUrl: z.string().optional(),
  // Legacy fields
  recipientName: z.string().optional(),
  recipientBank: z.string().optional(),
  accountNumber: z.string().optional(),
});

export const invoicesResponseSchema = z.object({
  data: z.array(invoiceSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export const invoiceResponseSchema = z.object({
  data: invoiceSchema,
});
