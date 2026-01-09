"use client";

import * as React from "react";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/lib/store";
import { formattedAmount, getCurrencySymbol } from "@/lib/finance-utils";
import { useReceivedPayableInvoiceAutoIssuanceStore } from "@/store/merchant/rp-invoice-auto-issuance-store";
import { useBasePath } from "@/hooks/use-base-path";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function ReceivedPayableInvoiceDetail({ id }: { id: string }) {
  const locale = useLocale();
  const t = useTranslations("Merchant.ReceivedPayableInvoiceAutoIssuance");
  const router = useRouter();

  const invoice = useReceivedPayableInvoiceAutoIssuanceStore((s) =>
    id ? s.getInvoiceById(id) : undefined,
  );

  const clients = useAppStore((s) => s.clients);
  const { basePath } = useBasePath();

  const client = React.useMemo(() => {
    if (!invoice) return undefined;
    return clients.find((c) => c.id === invoice.targetClient);
  }, [clients, invoice]);

  if (!id) {
    return (
      <div className="space-y-4">
        <div className="text-muted-foreground text-sm">
          {t("messages.missingId")}
        </div>
        <Button asChild variant="outline" className="h-9">
          <Link href={`${basePath}?tab=table`}>{t("buttons.back")}</Link>
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
          <Link href={`${basePath}?tab=table`}>{t("buttons.back")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {invoice.settingName}
          </h2>
          <Badge
            variant="outline"
            className="bg-emerald-50 capitalize text-emerald-700"
          >
            {invoice.status}
          </Badge>
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
              {t("columns.settingName")}
            </div>
            <div className="font-medium">{invoice.settingName}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.status")}
            </div>
            <Badge
              variant="outline"
              className="bg-emerald-50 capitalize text-emerald-700"
            >
              {invoice.status}
            </Badge>
          </div>

          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.targetClient")}
            </div>
            <div className="font-medium">{invoice?.targetClient ?? "—"}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.issuanceCycle")}
            </div>
            <div className="font-medium capitalize">
              {invoice.issuanceCycle ?? "—"}
            </div>
          </div>

          <div>
            <div className="text-muted-foreground text-xs">
              {t("form.nextIssuanceDate")}
            </div>
            <div className="font-medium">{invoice.nextIssuanceDate}</div>
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
