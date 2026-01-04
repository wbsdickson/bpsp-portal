"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMerchantStore } from "@/store/merchant-store";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useBasePath } from "@/hooks/use-base-path";
import { useMerchantBankAccountStore } from "@/store/merchant/merchant-bank-account-store";
import { Link } from "next-view-transitions";

export default function BankAccountDetail({
  bankAccountId,
}: {
  bankAccountId: string;
}) {
  const t = useTranslations("Merchant.BankAccounts");
  const router = useRouter();
  const locale = useLocale();

  const bankAccount = useMerchantBankAccountStore((s) =>
    s.getBankAccountById(bankAccountId),
  );

  const merchant = useMerchantStore((s) =>
    bankAccount?.merchantId
      ? s.getMerchantById(bankAccount.merchantId)
      : undefined,
  );

  if (!bankAccount || bankAccount.deletedAt) {
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

  const registrationLabel = bankAccount.createdAt
    ? (() => {
        const dt = new Date(bankAccount.createdAt);
        return Number.isNaN(dt.getTime())
          ? bankAccount.createdAt
          : dt.toLocaleString();
      })()
    : "—";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-9"
          onClick={() => {
            router.push(`/${locale}/merchant/bank-accounts`);
          }}
        >
          {t("buttons.cancel")}
        </Button>
        <Button asChild className="h-9 bg-indigo-600 hover:bg-indigo-700">
          <Link
            href={`/${locale}/merchant/bank-accounts/${bankAccount.id}/edit`}
          >
            {t("actions.edit")}
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.bankName")}
              </div>
              <div className="font-medium">{bankAccount.bankName}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.branchName")}
              </div>
              <div className="font-medium">{bankAccount.branchName}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.accountType")}
              </div>
              <div className="font-medium">{bankAccount.accountType}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.accountNumber")}
              </div>
              <div className="font-medium">{bankAccount.accountNumber}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.accountHolder")}
              </div>
              <div className="font-medium">{bankAccount.accountHolder}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">
                {t("columns.registrationDate")}
              </div>
              <div className="font-medium">{bankAccount.createdAt}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
