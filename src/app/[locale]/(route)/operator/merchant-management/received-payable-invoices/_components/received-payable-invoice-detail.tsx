"use client";

import * as React from "react";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/lib/store";
import { formattedAmount, getCurrencySymbol } from "@/lib/finance-utils";
import { useReceivedInvoiceStore } from "@/store/received-invoice-store";
import { useBasePath } from "@/hooks/use-base-path";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/status-badge";
import { getStatusBadgeVariant } from "../_hook/status";

export default function ReceivedPayableInvoiceDetail({ id }: { id: string }) {
  const locale = useLocale();
  const t = useTranslations("Operator.ReceivedPayableInvoices");
  const router = useRouter();

  const invoice = useReceivedInvoiceStore((s) =>
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

  if (!invoice) {
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {invoice.invoiceNumber}
          </h2>
          <StatusBadge variant={getStatusBadgeVariant(invoice.status)}>
            {t(`statuses.${invoice.status}`)}
          </StatusBadge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="xs"
            onClick={() => {
              // setIsEditing(true);
              router.push(`${basePath}/edit/${invoice.id}`);
            }}
            title={t("actions.edit")}
          >
            Edit
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-md p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.invoiceNumber")}
            </div>
            <div className="font-medium">{invoice.invoiceNumber}</div>
          </div>
          <div>
            <StatusBadge variant={getStatusBadgeVariant(invoice.status)}>
              {t(`statuses.${invoice.status}`)}
            </StatusBadge>
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
    </div>
  );
}
