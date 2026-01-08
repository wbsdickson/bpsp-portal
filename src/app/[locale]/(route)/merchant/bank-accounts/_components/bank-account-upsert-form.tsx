"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  bankAccountId,
}: {
  bankAccountId: string;
}) {
  const router = useRouter();
  const t = useTranslations("Merchant.BankAccounts");
  const { basePath } = useBasePath();

  const bankAccount = useMerchantBankAccountStore((s) =>
    s.getBankAccountById(bankAccountId),
  );
  const updateBankAccount = useMerchantBankAccountStore(
    (s) => s.updateBankAccount,
  );

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
    updateBankAccount(bankAccountId, {
      bankName: data.bankName.trim(),
      branchName: data.branchName.trim() || undefined,
      accountType: data.accountType,
      accountNumber: data.accountNumber.trim(),
      accountHolder: data.accountHolder.trim(),
    });
    toast.success(t("messages.updateSuccess"));
    router.push(`${basePath}`);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("form.editTitle")}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent>
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
                          <SelectValue
                            placeholder={t("form.selectAccountType")}
                          />
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
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountHolder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.accountHolder")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.accountHolderPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="justify-end gap-2">
            <Button
              
              variant="outline"
              className="h-9"
              onClick={() => router.push(basePath)}
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              type="submit"
              className="h-9"
              disabled={form.formState.isSubmitting}
            >
              {t("buttons.save")}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
