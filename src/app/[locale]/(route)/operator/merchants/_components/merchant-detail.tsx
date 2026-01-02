"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useInvoiceStore } from "@/store/invoice-store";
import { useMerchantStore } from "@/store/merchant-store";
import { useMerchantFeeStore } from "@/store/merchant-fee-store";
import { useMerchantMemberStore } from "@/store/merchant-member-store";
import { Link } from "next-view-transitions";
import { useLocale, useTranslations } from "next-intl";

export default function MerchantDetail({ merchantId }: { merchantId: string }) {
  const locale = useLocale();
  const t = useTranslations("Operator.Merchants");

  const merchant = useMerchantStore((s) => s.getMerchantById(merchantId));
  const fees = useMerchantFeeStore((s) => s.fees);
  const invoices = useInvoiceStore((s) => s.invoices);
  const members = React.useMemo(() => useMerchantMemberStore.getState().getMembersByMerchantId(merchantId), [merchantId]);

  if (!merchant) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm">
            {t("messages.merchantNotFound")}
          </div>
        </CardContent>
      </Card>
    );
  }

  const registrationLabel = merchant.createdAt
    ? (() => {
        const dt = new Date(merchant.createdAt);
        return Number.isNaN(dt.getTime())
          ? merchant.createdAt
          : dt.toLocaleString();
      })()
    : "—";

  const fee =
    fees.find((f) => f.merchantId === merchant.id && f.status === "active") ??
    fees.find((f) => f.merchantId === merchant.id);
  const feeRateLabel = fee ? `${fee.mdrPercent.toFixed(2)}%` : "—";

  const transactionAmount = React.useMemo(() => {
    return invoices
      .filter((inv) => !inv.deletedAt && inv.merchantId === merchant.id)
      .reduce(
        (acc, inv) =>
          acc +
          (typeof inv.amount === "number"
            ? inv.amount
            : Number(inv.amount ?? 0)),
        0,
      );
  }, [invoices, merchant.id]);

  const representative =
    members.find((m) => m.memberRole === "owner") ?? members[0];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button asChild className="h-9 bg-indigo-600 hover:bg-indigo-700">
          <Link href={`/${locale}/operator/merchants/edit/${merchant.id}`}>
            {t("actions.edit")}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Merchant information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.name")}
              </div>
              <div className="font-medium">{merchant.name}</div>
            </div>

            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.merchantId")}
              </div>
              <div className="font-medium">{merchant.id}</div>
            </div>

            <div>
              <div className="text-muted-foreground text-xs">Address</div>
              <div className="font-medium">{merchant.address ?? "—"}</div>
            </div>

            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.registrationDate")}
              </div>
              <div className="font-medium">{registrationLabel}</div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <div className="text-muted-foreground text-xs">
                Representative
              </div>
              <div className="font-medium">{representative?.name ?? "—"}</div>
            </div>

            <div>
              <div className="text-muted-foreground text-xs">Fee rate</div>
              <div className="font-medium">{feeRateLabel}</div>
            </div>

            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.transactionCount")}
              </div>
              <div className="font-medium">
                {merchant.transactionCount ?? 0}
              </div>
            </div>

            <div>
              <div className="text-muted-foreground text-xs">
                Transaction amount
              </div>
              <div className="font-medium">
                {transactionAmount.toLocaleString()}
              </div>
            </div>

            <div>
              <div className="text-muted-foreground text-xs">
                Contact person
              </div>
              <div className="font-medium">{representative?.name ?? "—"}</div>
            </div>

            <div>
              <div className="text-muted-foreground text-xs">Contact email</div>
              <div className="font-medium">{representative?.email ?? "—"}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
