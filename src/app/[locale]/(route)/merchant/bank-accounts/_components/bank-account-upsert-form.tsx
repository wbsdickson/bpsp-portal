"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMerchantBankAccountStore } from "@/store/merchant/merchant-bank-account-store";
import type { BankAccount } from "@/lib/types";
import { useBasePath } from "@/hooks/use-base-path";

type BankAccountUpsertValues = {
  bankName: string;
  branchName: string;
  accountType: BankAccount["accountType"];
  accountNumber: string;
  accountHolder: string;
};

const ACCOUNT_TYPES: BankAccount["accountType"][] = ["checking", "savings"];

export default function BankAccountUpsertForm({
  bankAccountId,
}: {
  bankAccountId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const t = useTranslations("Merchant.BankAccounts");
  const { basePath } = useBasePath();

  const bankAccount = useMerchantBankAccountStore((s) =>
    bankAccountId ? s.getBankAccountById(bankAccountId) : undefined,
  );
  const updateBankAccount = useMerchantBankAccountStore(
    (s) => s.updateBankAccount,
  );
  const addBankAccount = useMerchantBankAccountStore((s) => s.addBankAccount);

  const schema = React.useMemo(
    () =>
      z.object({
        bankName: z.string().min(1, t("validation.bankNameRequired")),
        branchName: z.string(),
        accountType: z.enum(["checking", "savings"]),
        accountNumber: z.string().min(1, t("validation.accountNumberRequired")),
        accountHolder: z.string().min(1, t("validation.accountHolderRequired")),
      }),
    [t],
  );

  const form = useForm<BankAccountUpsertValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      bankName: bankAccount?.bankName ?? "",
      branchName: bankAccount?.branchName ?? "",
      accountType: (bankAccount?.accountType ??
        "checking") as BankAccount["accountType"],
      accountNumber: bankAccount?.accountNumber ?? "",
      accountHolder: bankAccount?.accountHolder ?? "",
    },
  });

  useEffect(() => {
    if (!bankAccount) return;

    form.reset({
      bankName: bankAccount.bankName ?? "",
      branchName: bankAccount.branchName ?? "",
      accountType: (bankAccount.accountType ??
        "checking") as BankAccount["accountType"],
      accountNumber: bankAccount.accountNumber ?? "",
      accountHolder: bankAccount.accountHolder ?? "",
    });
  }, [form, bankAccount]);

  const onSubmit = form.handleSubmit((data) => {
    if (bankAccountId) {
      updateBankAccount(bankAccountId, {
        bankName: data.bankName.trim(),
        branchName: data.branchName.trim() || undefined,
        accountType: data.accountType,
        accountNumber: data.accountNumber.trim(),
        accountHolder: data.accountHolder.trim(),
      });
      toast.success(t("messages.updateSuccess"));
    } else {
      addBankAccount({
        bankName: data.bankName.trim(),
        branchName: data.branchName.trim() || undefined,
        accountType: data.accountType,
        accountNumber: data.accountNumber.trim(),
        accountHolder: data.accountHolder.trim(),
      } as any);
      toast.success(t("messages.createSuccess"));
    }

    router.push(basePath);
  });

  return (
    <div className="bg-card min-h-[calc(100vh-0px)] rounded-lg p-4">
      <div className="bg-card/95 sticky top-0 z-10 border-b backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-2">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => router.back()}>
            <X className="h-4 w-4" />
          </Button>

          <div className="flex-1">
            <div className="text-xl font-bold">
              {bankAccountId ? t("form.editTitle") : t("form.createTitle")}
            </div>
          </div>

          <Button
            size="sm"
            className="h-9"
            onClick={onSubmit}
            disabled={form.formState.isSubmitting}
          >
            {bankAccountId ? t("buttons.save") : t("buttons.create")}
          </Button>
        </div>
      </div>

      <div className="p-4">
        <Form {...form}>
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.bankName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.bankNamePlaceholder")}
                        className="h-9"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="branchName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.branchName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.branchNamePlaceholder")}
                        className="h-9"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.accountType")}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 w-full">
                          <SelectValue placeholder={t("form.selectAccountType")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ACCOUNT_TYPES.map((v) => (
                          <SelectItem key={v} value={v}>
                            {t(`accountTypes.${v}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.accountNumber")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.accountNumberPlaceholder")}
                        className="h-9"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="accountHolder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("columns.accountHolder")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.accountHolderPlaceholder")}
                      className="h-9"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}
