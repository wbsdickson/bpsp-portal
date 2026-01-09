"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMerchantStore } from "@/store/merchant-store";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useBasePath } from "@/hooks/use-base-path";
import { useMerchantBankAccountStore } from "@/store/merchant/merchant-bank-account-store";
import Link from "next/link";

export default function BankAccountDetail({
  bankAccountId,
}: {
  bankAccountId: string;
}) {
  const t = useTranslations("Merchant.BankAccounts");
  const router = useRouter();
  const { basePath } = useBasePath();

  const bankAccount = useMerchantBankAccountStore((s) =>
    s.getBankAccountById(bankAccountId),
  );

  if (!bankAccount || bankAccount.deletedAt) {
    return (
      <div className="space-y-4">
        <div className="text-muted-foreground text-sm">
          {t("messages.notFound")}
        </div>
        <Button asChild variant="outline" className="h-9">
          <Link href={`${basePath}?tab=table`}>{t("buttons.back")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {bankAccount.bankName}
          </h2>
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700"
          >
            {t(`accountTypes.${bankAccount.accountType}`)}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="xs"
            onClick={() => {
              router.push(`${basePath}/edit/${bankAccount.id}`);
            }}
            title={t("actions.edit")}
          >
            Edit
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-md p-4">
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
            <Badge
              variant="outline"
              className="bg-emerald-50 text-emerald-700"
            >
              {t(`accountTypes.${bankAccount.accountType}`)}
            </Badge>
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
            <div className="font-medium">
              {bankAccount.createdAt ? new Date(bankAccount.createdAt).toLocaleDateString() : "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
