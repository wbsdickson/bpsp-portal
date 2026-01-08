"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useBankAccountStore } from "@/store/bank-account-store";
import { useMerchantStore } from "@/store/merchant-store";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useBasePath } from "@/hooks/use-base-path";
import Link from "next/link";
import { Pen, Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InlineEditField } from "@/components/inline-edit-field";
import { toast } from "sonner";
import { TitleField } from "@/components/title-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BankAccount } from "@/lib/types";

export default function BankAccountDetail({
  bankAccountId,
}: {
  bankAccountId: string;
}) {
  const t = useTranslations("Operator.BankAccounts");
  const router = useRouter();
  const { basePath } = useBasePath();

  const bankAccount = useBankAccountStore((s) =>
    s.getBankAccountById(bankAccountId),
  );
  const updateBankAccount = useBankAccountStore((s) => s.updateBankAccount);

  const merchant = useMerchantStore((s) =>
    bankAccount?.merchantId
      ? s.getMerchantById(bankAccount.merchantId)
      : undefined,
  );

  const [isEditing, setIsEditing] = useState(false);

  const schema = React.useMemo(
    () =>
      z.object({
        bankName: z.string().min(1, t("validation.bankNameRequired")),
        branchName: z.string().optional(),
        accountType: z.enum(["savings", "checking"]),
        accountNumber: z.string().min(1, t("validation.accountNumberRequired")),
        accountHolder: z.string().min(1, t("validation.accountHolderRequired")),
      }),
    [t],
  );

  type BankAccountValues = z.infer<typeof schema>;

  const form = useForm<BankAccountValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      bankName: bankAccount?.bankName ?? "",
      branchName: bankAccount?.branchName ?? "",
      accountType: (bankAccount?.accountType ??
        "savings") as BankAccount["accountType"],
      accountNumber: bankAccount?.accountNumber ?? "",
      accountHolder: bankAccount?.accountHolder ?? "",
    },
  });

  useEffect(() => {
    if (bankAccount) {
      form.reset({
        bankName: bankAccount.bankName,
        branchName: bankAccount.branchName ?? "",
        accountType: bankAccount.accountType,
        accountNumber: bankAccount.accountNumber,
        accountHolder: bankAccount.accountHolder,
      });
    }
  }, [bankAccount, form, isEditing]);

  if (!bankAccount || bankAccount.deletedAt) {
    return (
      <div className="space-y-4">
        <div className="text-muted-foreground text-sm">
          {t("messages.notFound")}
        </div>
        <Button asChild variant="outline" className="h-9">
          <Link href={`${basePath}/bank-accounts`}>{t("buttons.back")}</Link>
        </Button>
      </div>
    );
  }

  const onSubmit = form.handleSubmit((data) => {
    updateBankAccount(bankAccountId, {
      bankName: data.bankName,
      branchName: data.branchName?.trim() || undefined,
      accountType: data.accountType,
      accountNumber: data.accountNumber,
      accountHolder: data.accountHolder,
    });
    toast.success(t("messages.updateSuccess"));
    setIsEditing(false);
  });

  const onCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const registrationLabel = bankAccount.createdAt
    ? (() => {
        const dt = new Date(bankAccount.createdAt);
        return Number.isNaN(dt.getTime())
          ? bankAccount.createdAt
          : dt.toLocaleString();
      })()
    : "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{bankAccount.bankName}</h3>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="secondary"
                size="xs"
                onClick={onCancel}
                title={t("buttons.cancel")}
              >
                Discard
              </Button>
              <Button
                variant="secondary"
                size="xs"
                onClick={onSubmit}
                title={t("buttons.save")}
              >
                Save
              </Button>
            </>
          ) : (
            <Button
              variant="secondary"
              size="xs"
              onClick={() => setIsEditing(true)}
              title={t("actions.edit")}
            >
              Edit
            </Button>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className="bg-card grid grid-cols-1 gap-6 rounded-md p-4 md:grid-cols-2">
            <InlineEditField
              control={form.control}
              name="bankName"
              label={t("columns.bankName")}
              isEditing={isEditing}
              value={bankAccount.bankName}
              renderInput={(field) => <Input {...field} />}
            />
            <InlineEditField
              control={form.control}
              name="branchName"
              label={t("columns.branchName")}
              isEditing={isEditing}
              value={bankAccount.branchName ?? "—"}
              renderInput={(field) => <Input {...field} />}
            />
            <InlineEditField
              control={form.control}
              name="accountType"
              label={t("columns.accountType")}
              isEditing={isEditing}
              value={t(`accountTypes.${bankAccount.accountType}`)}
              renderInput={(field) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="savings">
                      {t("accountTypes.savings")}
                    </SelectItem>
                    <SelectItem value="checking">
                      {t("accountTypes.checking")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <InlineEditField
              control={form.control}
              name="accountNumber"
              label={t("columns.accountNumber")}
              isEditing={isEditing}
              value={bankAccount.accountNumber}
              renderInput={(field) => <Input {...field} />}
            />
            <InlineEditField
              control={form.control}
              name="accountHolder"
              label={t("columns.accountHolder")}
              isEditing={isEditing}
              value={bankAccount.accountHolder}
              renderInput={(field) => <Input {...field} />}
            />
            <TitleField
              label={t("columns.registrationDate")}
              value={registrationLabel}
            />
            <TitleField
              label={t("columns.merchantId")}
              value={
                <div className="font-mono">
                  {bankAccount.merchantId ? `${merchant?.name ?? "—"} ` : "—"}
                </div>
              }
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
