"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useMerchantStore } from "@/store/merchant-store";
import { useMidStore } from "@/store/mid-store";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function MidDetail({ id }: { id: string }) {
  const t = useTranslations("Operator.MID");
  const router = useRouter();

  const mid = useMidStore((s) => (id ? s.getMidById(id) : undefined));
  const merchants = useMerchantStore((s) => s.merchants);

  const linkedMerchants = React.useMemo(() => {
    if (!mid) return [];
    const byId = new Map(merchants.map((m) => [m.id, m] as const));
    return (mid.linkedMerchantIds ?? [])
      .map((merchantId) => byId.get(merchantId))
      .filter((m): m is (typeof merchants)[number] => Boolean(m));
  }, [merchants, mid]);

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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle>{mid.mid}</CardTitle>
          <Button
            type="button"
            className="h-9 bg-indigo-600 hover:bg-indigo-700"
            onClick={() => router.push(`/operator/mid/edit/${mid.id}`)}
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
              {t("columns.connectionEndpoint")}
            </div>
            <div className="break-all font-medium">
              {mid.connectionEndpoint || "—"}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.status")}
            </div>
            <div className="font-medium">{t(`statuses.${mid.status}`)}</div>
          </div>
        </div>

        <Separator className="my-4" />

        <div>
          <div className="text-sm font-semibold">
            {t("columns.linkedMerchants")}
          </div>
          <div className="mt-2 space-y-1">
            {linkedMerchants.length ? (
              linkedMerchants.map((m) => (
                <div key={m.id} className="text-sm">
                  {m.name ?? "—"}
                </div>
              ))
            ) : (
              <div className="text-muted-foreground text-sm">—</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
