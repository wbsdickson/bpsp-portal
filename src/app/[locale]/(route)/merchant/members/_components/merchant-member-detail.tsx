"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMerchantMemberStore } from "@/store/merchant/merchant-member-store";
import { Link } from "next-view-transitions";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function MerchantMemberDetail({ userId }: { userId: string }) {
  const locale = useLocale();
  const t = useTranslations("Merchant.MerchantMembers");
  const router = useRouter();
  const user = useMerchantMemberStore((s) => s.getMemberById(userId));

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
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          className="h-9"
          onClick={() => {
            router.push(`/${locale}/merchant/members`);
          }}
        >
          {t("buttons.cancel")}
        </Button>
        <Button asChild className="h-9">
          <Link href={`/${locale}/merchant/members/edit/${user.id}`}>
            {t("actions.edit")}
          </Link>
        </Button>
      </div>

      <Card>
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
                {t("columns.lastLoginAt")}
              </div>
              <div className="font-medium">{lastLoginLabel}</div>
            </div>
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
              <div className="font-medium">{user.merchantId ?? "—"}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
