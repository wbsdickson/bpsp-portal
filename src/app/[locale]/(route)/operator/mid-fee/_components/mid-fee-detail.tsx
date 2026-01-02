"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useMidFeeStore } from "@/store/mid-fee-store";
import { useMidStore } from "@/store/mid-store";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function MidFeeDetail({ feeId }: { feeId: string }) {
  const t = useTranslations("Operator.MIDFee");
  const router = useRouter();

  const fee = useMidFeeStore((s) => (feeId ? s.getFeeById(feeId) : undefined));
  const mid = useMidStore((s) =>
    fee?.midId ? s.getMidById(fee.midId) : undefined,
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

  const updatedAtLabel = fee.updatedAt
    ? (() => {
        const dt = new Date(fee.updatedAt);
        return Number.isNaN(dt.getTime()) ? fee.updatedAt : dt.toLocaleString();
      })()
    : "—";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle>{mid?.mid ?? fee.midId}</CardTitle>
          <Button
            type="button"
            className="h-9 bg-indigo-600 hover:bg-indigo-700"
            onClick={() => router.push(`/operator/mid-fee/edit/${fee.id}`)}
          >
            {t("actions.edit")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.mid")}
            </div>
            <div className="font-medium">{mid?.mid ?? fee.midId}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.brand")}
            </div>
            <div className="font-medium">{mid?.brand ?? "—"}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.status")}
            </div>
            <div className="font-medium">{t(`statuses.${fee.status}`)}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.updatedAt")}
            </div>
            <div className="font-medium">{updatedAtLabel}</div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.mdr")}
            </div>
            <div className="font-medium">{fee.mdrPercent.toFixed(2)}%</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.fixedFeeAmount")}
            </div>
            <div className="font-medium">{fee.fixedFeeAmount.toFixed(2)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
