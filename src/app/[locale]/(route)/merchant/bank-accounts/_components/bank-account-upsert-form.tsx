"use client";

import * as React from "react";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useBasePath } from "@/hooks/use-base-path";
import { toast } from "sonner";

type BankAccountUpsertValues = {
  bankName: string;
  branchName: string;
  accountType: BankAccount["accountType"];
  accountNumber: string;
  accountHolder: string;
};

const ACCOUNT_TYPES: BankAccount["accountType"][] = ["checking", "savings"];

export default function BankAccountUpsertForm({
  onSuccess,
  onCancel,
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
    form.reset({
      bankName: bankAccount?.bankName ?? "",
      branchName: bankAccount?.branchName ?? "",
      accountType: (bankAccount?.accountType ??
        "checking") as BankAccount["accountType"],
      accountNumber: bankAccount?.accountNumber ?? "",
      accountHolder: bankAccount?.accountHolder ?? "",
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

    if (onSuccess) {
      onSuccess();
    } else {
      router.push(basePath);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
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

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button variant="outline" className="h-9" onClick={onCancel}>
              {t("buttons.cancel")}
            </Button>
          )}
          <Button
            type="submit"
            className="h-9"
            disabled={form.formState.isSubmitting}
          >
            {t("buttons.save")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
