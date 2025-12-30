"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useMerchantStore } from "@/store/merchant-store";
import { Link } from "next-view-transitions";
import { useLocale, useTranslations } from "next-intl";

export default function MerchantDetail({ merchantId }: { merchantId: string }) {
  const locale = useLocale();
  const t = useTranslations("Operator.Merchants");

  const merchant = useMerchantStore((s) => s.getMerchantById(merchantId));

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
          <CardTitle>{merchant.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.merchantId")}
              </div>
              <div className="font-medium">{merchant.id}</div>
            </div>

            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.registrationDate")}
              </div>
              <div className="font-medium">{registrationLabel}</div>
            </div>

            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.status")}
              </div>
              <div className="font-medium">{merchant.status ?? "—"}</div>
            </div>

            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.transactionCount")}
              </div>
              <div className="font-medium">
                {merchant.transactionCount ?? 0}
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.name")}
              </div>
              <div className="font-medium">{merchant.name}</div>
            </div>

            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.invoiceEmail")}
              </div>
              <div className="font-medium">{merchant.invoiceEmail}</div>
            </div>

            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.enableCreditPayment")}
              </div>
              <div className="font-medium">
                {merchant.enableCreditPayment
                  ? t("labels.yes")
                  : t("labels.no")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
