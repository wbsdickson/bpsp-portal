"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useMerchantMemberStore } from "@/store/merchant-member-store";
import { useMerchantStore } from "@/store/merchant-store";
import { Link } from "next-view-transitions";
import { useLocale, useTranslations } from "next-intl";
import { useBasePath } from "@/hooks/use-base-path";

export default function MerchantMemberDetail({ userId }: { userId: string }) {
  const locale = useLocale();
  const t = useTranslations("Operator.MerchantMembers");
  const { basePath } = useBasePath();

  const user = useMerchantMemberStore((s) => s.getMemberById(userId));
  const merchant = useMerchantStore((s) =>
    user?.merchantId ? s.getMerchantById(user.merchantId) : undefined,
  );

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm">
            {t("messages.userNotFound")}
          </div>
        </CardContent>
      </Card>
    );
  }

  const registrationLabel = user.createdAt
    ? (() => {
        const dt = new Date(user.createdAt);
        return Number.isNaN(dt.getTime())
          ? user.createdAt
          : dt.toLocaleString();
      })()
    : "—";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button asChild className="h-9 bg-indigo-600 hover:bg-indigo-700">
          <Link href={`${basePath}/edit/${user.id}`}>{t("actions.edit")}</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.name")}
              </div>
              <div className="font-medium">{user.name}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.email")}
              </div>
              <div className="font-medium">{user.email}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.role")}
              </div>
              <div className="font-medium">
                {user.memberRole ?? user.role ?? "—"}
              </div>
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
              <div className="font-medium">{user.status ?? "—"}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.merchantId")}
              </div>
              <div className="font-medium">
                {user.merchantId
                  ? `${merchant?.name ?? "—"} (${user.merchantId})`
                  : "—"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
