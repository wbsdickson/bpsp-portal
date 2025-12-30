"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useMerchantStore } from "@/store/merchant-store";
import { useMerchantMidStore } from "@/store/merchant-mid-store";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function MerchantMidDetail({ midId }: { midId: string }) {
  const t = useTranslations("Operator.MerchantMIDs");
  const router = useRouter();
  console.log(midId);
  const mid = useMerchantMidStore((s) => s.getMidById(midId));
  const merchant = useMerchantStore((s) =>
    mid?.merchantId ? s.getMerchantById(mid.merchantId) : undefined,
  );

  if (!mid) {
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

  const registrationLabel = mid.createdAt
    ? (() => {
        const dt = new Date(mid.createdAt);
        return Number.isNaN(dt.getTime()) ? mid.createdAt : dt.toLocaleString();
      })()
    : "—";

  const activeLabel =
    mid.status === "active" ? t("active.active") : t("active.inactive");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle>{mid.mid}</CardTitle>
          <Button
            type="button"
            className="h-9 bg-indigo-600 hover:bg-indigo-700"
            onClick={() => router.push(`/operator/merchant-mid/edit/${mid.id}`)}
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
            <div className="font-medium">{mid.mid}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.brand")}
            </div>
            <div className="font-medium">{mid.brand}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.merchantName")}
            </div>
            <div className="font-medium">{merchant?.name ?? "—"}</div>
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
              {t("columns.status")}
            </div>
            <div className="font-medium capitalize">{mid.status}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.active")}
            </div>
            <div className="font-medium">{activeLabel}</div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            variant="outline"
            className="h-9"
            onClick={() => navigator.clipboard?.writeText(mid.mid)}
          >
            {t("actions.copyMid")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
