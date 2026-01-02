"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "next-view-transitions";
import { useLocale, useTranslations } from "next-intl";
import { useAccountStore } from "@/store/account-store";

export default function UserDetail({ userId }: { userId: string }) {
  const locale = useLocale();
  const t = useTranslations("Operator.Accounts");
  const user = useAccountStore((s) => s.accounts.find((u) => u.id === userId));

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

  const lastLoginLabel = user.lastLoginAt
    ? (() => {
        const dt = new Date(user.lastLoginAt);
        return Number.isNaN(dt.getTime())
          ? user.lastLoginAt
          : dt.toLocaleString();
      })()
    : "—";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button asChild className="h-9 bg-indigo-600 hover:bg-indigo-700">
          <Link href={`/${locale}/operator/accounts/edit/${user.id}`}>
            {t("actions.edit")}
          </Link>
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
              <div className="font-medium">{user.role}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.lastLoginAt")}
              </div>
              <div className="font-medium">{lastLoginLabel}</div>
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
                {t("columns.company")}
              </div>
              <div className="font-medium">{user.companyName ?? "—"}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
