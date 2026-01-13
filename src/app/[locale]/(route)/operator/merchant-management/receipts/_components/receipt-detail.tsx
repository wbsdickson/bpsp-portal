"use client";

import * as React from "react";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

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
import { useReceiptStore } from "@/store/receipt-store";
import { useBasePath } from "@/hooks/use-base-path";
import { Badge } from "@/components/ui/badge";
import { getReceiptBadgeVariant, ReceiptStatus } from "../_hook/status";

export default function ReceiptDetail({ id }: { id: string }) {
  const locale = useLocale();
  const t = useTranslations("Operator.Receipt");
  const { basePath } = useBasePath();

  const receipt = useReceiptStore((s) =>
    id ? s.getReceiptById(id) : undefined,
  );
  const clients = useAppStore((s) => s.clients);
  const taxes = useAppStore((s) => s.taxes);

  const client = React.useMemo(() => {
    if (!receipt) return undefined;
    return clients.find((c) => c.id === receipt.clientId);
  }, [clients, receipt]);

  const taxById = React.useMemo(() => {
    const map = new Map<string, string>();
    (taxes ?? []).forEach((t) => map.set(t.id, t.name));
    return map;
  }, [taxes]);

  if (!id) {
    return (
      <div className="space-y-4">
        <div className="text-muted-foreground text-sm">
          {t("messages.missingId")}
        </div>
        <Button asChild variant="outline" className="h-9">
          <Link href={`/${locale}/operator/receipt`}>{t("buttons.back")}</Link>
        </Button>
      </div>
    );
  }

  if (!receipt) {
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
        <Button asChild variant="secondary" size="xs">
          <Link href={`${basePath}/edit/${receipt.id}`}>
            {t("buttons.edit")}
          </Link>
        </Button>
      </div>
      <div className="bg-card rounded-xl border p-4">
        <div className="">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.receiptNumber")}
              </div>
              <div className="font-medium">{receipt.receiptNumber}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.status")}
              </div>
              <div className="font-medium">
                <Badge
                  variant={getReceiptBadgeVariant(
                    (receipt.status as ReceiptStatus) || "draft",
                  )}
                >
                  {t(`statuses.${receipt.status}`)}
                </Badge>
              </div>
            </div>

            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.client")}
              </div>
              <div className="font-medium">
                {client?.name ?? t("messages.empty")}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.issueDate")}
              </div>
              <div className="font-medium">{receipt.issueDate}</div>
            </div>

            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.amount")}
              </div>
              <div className="font-medium">{`${getCurrencySymbol(receipt.currency)} ${formattedAmount(
                receipt.amount,
                receipt.currency,
              )}`}</div>
            </div>

            <div>
              <div className="text-muted-foreground text-xs">
                {t("form.pdf")}
              </div>
              <div className="font-medium">
                {receipt.uploadedPdfName ?? t("messages.empty")}
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="text-muted-foreground text-xs">
                {t("form.notes")}
              </div>
              <div className="whitespace-pre-wrap font-medium">
                {receipt.notes ?? t("messages.empty")}
              </div>
            </div>
          </div>
        </div>

        <div className="">
          <div className="py-3">
            <div className="text-sm font-semibold">{t("form.items")}</div>
          </div>
          <div className="">
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("form.item")}</TableHead>
                    <TableHead className="w-[90px] text-right">
                      {t("form.quantity")}
                    </TableHead>
                    <TableHead className="w-[160px] text-right">
                      {t("form.unitPrice")}
                    </TableHead>
                    <TableHead className="w-[160px] text-right">
                      {t("form.taxCategory")}
                    </TableHead>
                    <TableHead className="w-[160px] text-right">
                      {t("columns.amount")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(receipt.items ?? []).map((it) => (
                    <TableRow key={it.id}>
                      <TableCell className="text-sm">
                        {it.name || t("messages.empty")}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {it.quantity}
                      </TableCell>
                      <TableCell className="text-right text-sm">{`${getCurrencySymbol(
                        receipt.currency,
                      )} ${formattedAmount(it.unitPrice, receipt.currency)}`}</TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        {taxById.get(it.taxId) ?? t("messages.empty")}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">{`${getCurrencySymbol(
                        receipt.currency,
                      )} ${formattedAmount(it.amount, receipt.currency)}`}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
