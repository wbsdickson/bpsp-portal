"use client";

import * as React from "react";

import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";

import type { BankAccount, Client, Item, Merchant, Tax } from "@/lib/types";
import { formatDate } from "@/lib/date-utils";
import type { FieldArrayWithId, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formattedAmount, getCurrencySymbol } from "@/lib/finance-utils";

type LineItem = {
  id: string;
  itemId?: string;
  description: string;
  transactionDate?: string;
  quantity: number;
  unit?: string;
  unitPrice: number;
  taxId?: string;
  withholdingTax?: boolean;
};

const lineItemFormSchema = z.object({
  itemId: z.string().optional(),
  description: z.string().optional(),
  transactionDate: z.string().optional(),
  quantity: z.number().min(1),
  unit: z.string().optional(),
  unitPrice: z.number().min(0),
  taxId: z.string().optional(),
  withholdingTax: z.boolean().optional(),
});

const invoiceUpsertFormSchema = z.object({
  merchantId: z.string().min(1),
  clientId: z.string().min(1),
  honorific: z.string().optional(),
  invoiceDate: z.string().min(1),
  dueDate: z.string().optional(),
  subject: z.string().optional(),
  amount: z.number().min(0),
  currency: z.string().min(1),
  updatedAt: z.string().optional(),
  invoiceNumber: z.string().min(1),
  items: z.array(lineItemFormSchema).min(1),
  bankAccountId: z.string().optional(),
  remark: z.string().optional(),
});

type InvoiceUpsertFormValues = z.infer<typeof invoiceUpsertFormSchema>;

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

type CreateInvoiceFormProps = {
  form: UseFormReturn<InvoiceUpsertFormValues>;
  merchants: Merchant[];
  availableCustomers: Client[];
  availableItems: Item[];
  taxes: Tax[];
  bankAccounts: BankAccount[];
  selectedMerchant: Merchant | null;
  subtotal: number;
  itemFields: FieldArrayWithId<InvoiceUpsertFormValues, "items", "id">[];
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
};

type InvoicePreviewProps = {
  customer: Client | null;
  currency: string;
  subtotal: number;
  invoiceNumber: string;
  items: LineItem[];
  taxes: Tax[];
};

export default function InvoicePreview({
  customer,
  currency,
  subtotal,
  invoiceNumber,
  items,
  taxes,
}: InvoicePreviewProps) {
  const t = useTranslations("Operator.Invoice");
  const taxById = React.useMemo(() => {
    const map = new Map<string, Tax>();
    taxes.forEach((t) => map.set(t.id, t));
    return map;
  }, [taxes]);

  return (
    <div className="bg-muted/40 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">{t("preview.title")}</div>
        {/* <Button variant="ghost" size="icon" className="h-8 w-8">
          <ExternalLink className="h-4 w-4" />
        </Button> */}
      </div>

      <div className="bg-background mt-4 rounded-xl border p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-semibold">{t("preview.invoice")}</div>
            <div className="text-muted-foreground mt-2 grid gap-1 text-xs">
              <div>
                <span className="text-foreground font-medium">
                  {t("preview.invoiceNumber")}
                </span>
                : {invoiceNumber}
              </div>
              <div>
                <span className="text-foreground font-medium">
                  {t("preview.dateOfIssue")}
                </span>
                : {formatDate(new Date().toISOString())}
              </div>
            </div>
          </div>

          {/* <div className="text-right">
            <div className="text-muted-foreground text-xs">
              acct_1SezNrLzWZr8P1xn
            </div>
            <div className="text-muted-foreground mt-2 text-xs">
              United States
            </div>
          </div> */}
        </div>

        <Separator className="my-4" />

        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-muted-foreground text-xs">
              {t("preview.billTo")}
            </div>
            <div className="text-sm font-medium">{customer?.name ?? "—"}</div>
            <div className="text-muted-foreground text-xs">
              {customer?.email ?? ""}
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-2">
                  {t("preview.table.description")}
                </TableHead>
                <TableHead className="px-2 text-center">
                  {t("upsert.table.transactionDate")}
                </TableHead>
                <TableHead className="px-2 text-right">
                  {t("preview.table.qty")}
                </TableHead>
                <TableHead className="px-2 text-center">
                  {t("upsert.table.unit")}
                </TableHead>
                <TableHead className="px-2 text-right">
                  {t("preview.table.unitPrice")}
                </TableHead>
                <TableHead className="px-2 text-right">
                  {t("preview.table.taxCategory")}
                </TableHead>
                <TableHead className="w-[140px] px-2 text-center leading-tight">
                  <div className="whitespace-normal">
                    {t("upsert.table.withholdingTax")}
                  </div>
                </TableHead>
                <TableHead className="px-2 text-right">
                  {t("preview.table.amount")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((it) => (
                <TableRow key={it.id}>
                  <TableCell className="px-2 text-sm">
                    {it.description || "—"}
                  </TableCell>
                  <TableCell className="px-2 text-center text-sm">
                    {formatDate(it.transactionDate)}
                  </TableCell>
                  <TableCell className="px-2 text-right text-sm">
                    {it.quantity}
                  </TableCell>
                  <TableCell className="px-2 text-center text-sm">
                    {it.unit || "—"}
                  </TableCell>
                  <TableCell className="px-2 text-right text-sm">
                    {`${getCurrencySymbol(currency)} ${formattedAmount(it.unitPrice, currency)}`}
                  </TableCell>
                  <TableCell className="px-2 text-right text-sm font-medium">
                    {taxById.get(it.taxId ?? "")?.name ?? "—"}
                  </TableCell>
                  <TableCell className="px-2 text-center text-sm">
                    {it.withholdingTax ? "○" : "—"}
                  </TableCell>
                  <TableCell className="px-2 text-right text-sm font-medium">
                    {`${getCurrencySymbol(currency)} ${formattedAmount(
                      it.quantity * it.unitPrice +
                        Math.round(
                          it.quantity *
                            it.unitPrice *
                            (taxById.get(it.taxId ?? "")?.rate ?? 0),
                        ),
                      currency,
                    )}`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <div className="w-full max-w-[280px] space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">
                {t("preview.subtotal")}
              </div>
              <div className="font-medium">
                {formatMoney(subtotal, currency)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">{t("preview.total")}</div>
              <div className="font-semibold">
                {formatMoney(subtotal, currency)}
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">
                {t("preview.amountDue")}
              </div>
              <div className="font-semibold">
                {formatMoney(subtotal, currency)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
