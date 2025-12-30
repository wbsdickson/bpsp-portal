"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useMerchantFeeStore } from "@/store/merchant-fee-store";
import { useMerchantStore } from "@/store/merchant-store";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function MerchantFeeDetail({ feeId }: { feeId: string }) {
  const t = useTranslations("Operator.MerchantFees");
  const router = useRouter();

  const fee = useMerchantFeeStore((s) => s.getFeeById(feeId));
  const merchant = useMerchantStore((s) =>
    fee?.merchantId ? s.getMerchantById(fee.merchantId) : undefined,
  );

  if (!fee) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm">
            {t("messages.notFound")}
          </div>
        </CardContent>
      </Card>
    );
  }

  const registrationLabel = fee.createdAt
    ? (() => {
        const dt = new Date(fee.createdAt);
        return Number.isNaN(dt.getTime()) ? fee.createdAt : dt.toLocaleString();
      })()
    : "—";

  const updatedLabel = fee.updatedAt
    ? (() => {
        const dt = new Date(fee.updatedAt);
        return Number.isNaN(dt.getTime()) ? fee.updatedAt : dt.toLocaleString();
      })()
    : "—";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle>{merchant?.name ?? fee.merchantId}</CardTitle>
          <Button
            type="button"
            className="h-9 bg-indigo-600 hover:bg-indigo-700"
            onClick={() => router.push(`/operator/merchant-fee/edit/${fee.id}`)}
          >
            {t("actions.edit")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.merchantName")}
            </div>
            <div className="font-medium">{merchant?.name ?? "—"}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.brand")}
            </div>
            <div className="font-medium">{fee.brand}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.paymentMethodType")}
            </div>
            <div className="font-medium">
              {t(`paymentMethodTypes.${fee.paymentMethodType}`)}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.status")}
            </div>
            <div className="font-medium capitalize">{fee.status}</div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.mdrPercent")}
            </div>
            <div className="font-medium">{fee.mdrPercent.toFixed(2)}%</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.fixedFee")}
            </div>
            <div className="font-medium">{fee.fixedFee.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.registrationDate")}
            </div>
            <div className="font-medium">{registrationLabel}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.lastUpdatedDate")}
            </div>
            <div className="font-medium">{updatedLabel}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
