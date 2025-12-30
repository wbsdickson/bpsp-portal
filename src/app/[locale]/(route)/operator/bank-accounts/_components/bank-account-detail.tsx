"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useBankAccountStore } from "@/store/bank-account-store";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function BankAccountDetail({
  bankAccountId,
}: {
  bankAccountId: string;
}) {
  const t = useTranslations("Operator.BankAccounts");
  const router = useRouter();

  const bankAccount = useBankAccountStore((s) =>
    s.getBankAccountById(bankAccountId),
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
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle>{bankAccount.bankName}</CardTitle>
          <Button
            type="button"
            className="h-9 bg-indigo-600 hover:bg-indigo-700"
            onClick={() =>
              router.push(`/operator/bank-accounts/edit/${bankAccount.id}`)
            }
          >
            {t("actions.edit")}
          </Button>
        </div>
      </CardHeader>
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
            <div className="font-medium">{bankAccount.branchName ?? "—"}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.accountType")}
            </div>
            <div className="font-medium">
              {t(`accountTypes.${bankAccount.accountType}`)}
            </div>
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
            <div className="font-medium">{registrationLabel}</div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <div className="text-muted-foreground text-xs">
              {t("columns.merchantId")}
            </div>
            <div className="font-medium">{bankAccount.merchantId}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
