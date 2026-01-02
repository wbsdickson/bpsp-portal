"use client";

import * as React from "react";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/lib/store";
import { formattedAmount, getCurrencySymbol } from "@/lib/finance-utils";
import { useInvoiceStore } from "@/store/invoice-store";
import { useBasePath } from "@/hooks/use-base-path";

export default function ReceivedPayableInvoiceDetail({ id }: { id: string }) {
  const locale = useLocale();
  const t = useTranslations("Operator.ReceivedPayableInvoices");

  const invoice = useInvoiceStore((s) =>
    id ? s.getInvoiceById(id) : undefined,
  );
  const clients = useAppStore((s) => s.clients);
  const { basePath } = useBasePath();

  const client = React.useMemo(() => {
    if (!invoice) return undefined;
    return clients.find((c) => c.id === invoice.clientId);
  }, [clients, invoice]);

  if (!id) {
    return (
      <div className="space-y-4">
        <div className="text-muted-foreground text-sm">
          {t("messages.missingId")}
        </div>
        <Button asChild variant="outline" className="h-9">
          <Link href={`${basePath}`}>{t("buttons.back")}</Link>
        </Button>
      </div>
    );
  }

  if (!invoice || invoice.direction !== "payable") {
    return (
      <div className="space-y-4">
        <div className="text-muted-foreground text-sm">
          {t("messages.notFound")}
        </div>
        <Button asChild variant="outline" className="h-9">
          <Link href={`${basePath}`}>{t("buttons.back")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-3">
        <Button asChild className="h-9 bg-indigo-600 hover:bg-indigo-700">
          <Link href={`${basePath}/edit/${invoice.id}`}>
            {t("buttons.edit")}
          </Link>
        </Button>
      </div>

      <div className="bg-background rounded-xl border p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.invoiceNumber")}
            </div>
            <div className="font-medium">{invoice.invoiceNumber}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.status")}
            </div>
            <div className="font-medium">{invoice.status}</div>
          </div>

          <div>
            <div className="text-muted-foreground text-xs">
              {t("form.client")}
            </div>
            <div className="font-medium">{client?.name ?? "—"}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.paymentDueDate")}
            </div>
            <div className="font-medium">{invoice.dueDate ?? "—"}</div>
          </div>

          <div>
            <div className="text-muted-foreground text-xs">
              {t("form.invoiceDate")}
            </div>
            <div className="font-medium">{invoice.invoiceDate}</div>
          </div>

          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.amount")}
            </div>
            <div className="font-medium">{`${getCurrencySymbol(invoice.currency)} ${formattedAmount(
              invoice.amount,
              invoice.currency,
            )}`}</div>
          </div>

          <div className="md:col-span-2">
            <div className="text-muted-foreground text-xs">{t("form.pdf")}</div>
            <div className="break-all font-medium">
              {invoice.fileUrl ?? "—"}
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="text-muted-foreground text-xs">
              {t("form.notes")}
            </div>
            <div className="whitespace-pre-wrap font-medium">
              {invoice.notes ?? "—"}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background rounded-xl border">
        <div className="px-4 py-3">
          <div className="text-sm font-semibold">Items</div>
        </div>
        <Separator />
        <div className="p-4">
          <div className="text-muted-foreground text-sm">
            This page focuses on received payable invoices. Line items are not
            edited here.
          </div>
        </div>
      </div>
    </div>
  );
}
