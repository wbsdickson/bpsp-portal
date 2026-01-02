"use client";

import * as React from "react";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import HeaderPage from "@/components/header-page";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppStore } from "@/lib/store";
import { formattedAmount, getCurrencySymbol } from "@/lib/finance-utils";
import { useInvoiceStore } from "@/store/invoice-store";
import { useBasePath } from "@/hooks/use-base-path";

export default function InvoiceDetail({ id }: { id: string }) {
  const locale = useLocale();
  const t = useTranslations("Operator.Invoice");
  const { basePath } = useBasePath();

  const invoice = useInvoiceStore((s) =>
    id ? s.getInvoiceById(id) : undefined,
  );
  const clients = useAppStore((s) => s.clients);
  const merchants = useAppStore((s) => s.merchants);
  const taxes = useAppStore((s) => s.taxes);

  const taxById = React.useMemo(() => {
    const map = new Map<string, string>();
    (taxes ?? []).forEach((tx) => map.set(tx.id, tx.name));
    return map;
  }, [taxes]);

  const subtotal = React.useMemo(() => {
    return (invoice?.items ?? []).reduce(
      (sum, it) => sum + (it.amount ?? 0),
      0,
    );
  }, [invoice?.items]);

  const client = React.useMemo(() => {
    if (!invoice) return undefined;
    return clients.find((c) => c.id === invoice.clientId);
  }, [clients, invoice]);

  const merchant = React.useMemo(() => {
    if (!invoice) return undefined;
    return merchants.find((m) => m.id === invoice.merchantId);
  }, [invoice, merchants]);

  if (!id) {
    return (
      <HeaderPage title={t("invoiceNumber")}>
        <div className="space-y-4">
          <div className="text-muted-foreground text-sm">
            Missing invoice id.
          </div>
          <Button asChild variant="outline" className="h-9">
            <Link href={`/${locale}/operator/invoices`}>
              {t("payInfoBack")}
            </Link>
          </Button>
        </div>
      </HeaderPage>
    );
  }

  if (!invoice) {
    return (
      <HeaderPage title={t("invoiceNumber")}>
        <div className="space-y-4">
          <div className="text-muted-foreground text-sm">
            Invoice not found.
          </div>
          <Button asChild variant="outline" className="h-9">
            <Link href={`/${locale}/operator/invoices`}>
              {t("payInfoBack")}
            </Link>
          </Button>
        </div>
      </HeaderPage>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-end gap-3">
          {/* <Button asChild variant="outline" className="h-9">
            <Link href={`/${locale}/operator/invoices`}>
              {t("payInfoBack")}
            </Link>
          </Button> */}

          <Button asChild className="h-9 bg-indigo-600 hover:bg-indigo-700">
            <Link href={`${basePath}/edit/${invoice.id}`}>
              {t("editInvoice")}
            </Link>
          </Button>
        </div>

        <div className="bg-background rounded-xl border p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <div className="text-muted-foreground text-xs">
                {t("invoiceNumber")}
              </div>
              <div className="font-medium">{invoice.invoiceNumber}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">{t("status")}</div>
              <div className="font-medium">{invoice.status}</div>
            </div>

            <div>
              <div className="text-muted-foreground text-xs">
                {t("merchant")}
              </div>
              <div className="font-medium">{merchant?.name ?? "—"}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">{t("client")}</div>
              <div className="font-medium">
                {client?.name ?? invoice.recipientName ?? "—"}
              </div>
            </div>

            <div>
              <div className="text-muted-foreground text-xs">
                {t("issueDate")}
              </div>
              <div className="font-medium">{invoice.invoiceDate}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">{t("amount")}</div>
              <div className="font-medium">{`${getCurrencySymbol(invoice.currency)} ${formattedAmount(
                invoice.amount,
                invoice.currency,
              )}`}</div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-xl border">
          <div className="px-4 py-3">
            <div className="text-sm font-semibold">{t("upsert.items")}</div>
          </div>
          <Separator />
          <div className="p-4">
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("preview.table.description")}</TableHead>
                    <TableHead className="w-[90px] text-right">
                      {t("preview.table.qty")}
                    </TableHead>
                    <TableHead className="w-[160px] text-right">
                      {t("preview.table.unitPrice")}
                    </TableHead>
                    <TableHead className="w-[160px] text-right">
                      {t("preview.table.taxCategory")}
                    </TableHead>
                    <TableHead className="w-[160px] text-right">
                      {t("preview.table.amount")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(invoice.items ?? []).map((it) => (
                    <TableRow key={it.id}>
                      <TableCell className="text-sm">
                        {it.name || "—"}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {it.quantity}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {`${getCurrencySymbol(invoice.currency)} ${formattedAmount(
                          it.unitPrice,
                          invoice.currency,
                        )}`}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        {taxById.get(it.taxId) ?? "—"}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        {`${getCurrencySymbol(invoice.currency)} ${formattedAmount(
                          it.amount,
                          invoice.currency,
                        )}`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 flex items-center justify-end">
              <div className="w-full max-w-[320px] space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground">
                    {t("preview.subtotal")}
                  </div>
                  <div className="font-medium">{`${getCurrencySymbol(
                    invoice.currency,
                  )} ${formattedAmount(subtotal, invoice.currency)}`}</div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground">
                    {t("preview.total")}
                  </div>
                  <div className="font-semibold">{`${getCurrencySymbol(
                    invoice.currency,
                  )} ${formattedAmount(invoice.amount, invoice.currency)}`}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
