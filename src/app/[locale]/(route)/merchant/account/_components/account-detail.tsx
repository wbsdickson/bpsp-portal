"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "next-view-transitions";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMerchantAccountStore } from "@/store/merchant/merchant-account-store";
import { Badge } from "@/components/ui/badge";

export default function MerchantAccountDetail({
  accountId,
}: {
  accountId: string;
}) {
  const locale = useLocale();
  const t = useTranslations("Merchant.AccountInformationManagement");
  const router = useRouter();
  const account = useMerchantAccountStore((s) => s.getAccountById(accountId));

  if (!account) {
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

  const createdAtLabel = account.createdAt
    ? (() => {
        const dt = new Date(account.createdAt);
        return Number.isNaN(dt.getTime())
          ? account.createdAt
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
            router.push(`/${locale}/merchant/account`);
          }}
        >
          {t("buttons.cancel")}
        </Button>
        <Button asChild className="h-9">
          <Link href={`/${locale}/merchant/account/edit/${account.id}`}>
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
              <div className="font-medium">{account.name}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.email")}
              </div>
              <div className="font-medium">{account.email}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.role")}
              </div>
              <div className="font-medium">{account.role ?? "—"}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.createdAt")}
              </div>
              <div className="font-medium">{createdAtLabel}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.status")}
              </div>
              <div className="font-medium">
                {account.status === "active" ? (
                  <Badge variant="success">
                    {t(`statuses.${account.status}`)}
                  </Badge>
                ) : (
                  <Badge className="secondary">
                    {t(`statuses.${account.status}`)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
