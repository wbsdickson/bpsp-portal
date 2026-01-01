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
import { useMerchantStore } from "@/store/merchant-store";
import { useMerchantAccountStore } from "@/store/merchant/merchant-account-store";
import type { Account, MemberRole, UserRole } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type MerchantMemberStatus = "active" | "suspended";

type MerchantAccountUpsertValues = {
  merchantId: string;
  name: string;
  email: string;
  role: UserRole;
  memberRole: MemberRole;
  status: MerchantMemberStatus;
  password: string;
  confirmPassword: string;
};

const ROLE_OPTIONS: UserRole[] = [
  "merchant",
  "admin",
  "jpcc_admin",
  "merchant_jpcc",
];

const MEMBER_ROLE_OPTIONS: MemberRole[] = ["owner", "staff", "viewer"];

const STATUS_OPTIONS: MerchantMemberStatus[] = ["active", "suspended"];

export default function MerchantAccountUpsertForm({
  accountId,
}: {
  accountId?: string;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Merchant.AccountInformationManagement");
  const searchParams = useSearchParams();
  const preselectedMerchantId = searchParams.get("merchantId") ?? "";

  const account = useMerchantAccountStore((s) =>
    accountId ? s.getAccountById(accountId) : undefined,
  );

  const merchants = useMerchantStore((s) => s.merchants);
  const addAccount = useMerchantAccountStore((s) => s.addAccount);
  const updateAccount = useMerchantAccountStore((s) => s.updateAccount);

  const schema = React.useMemo(
    () =>
      z.object({
        merchantId: z.string().min(1, t("validation.merchantRequired")),
        name: z.string().min(1, t("validation.nameRequired")),
        email: z
          .string()
          .min(1, t("validation.emailRequired"))
          .email(t("validation.emailInvalid")),
        role: z.enum(["merchant", "admin", "jpcc_admin", "merchant_jpcc"]),
        memberRole: z.enum(["owner", "staff", "viewer"]),
        status: z.enum(["active", "suspended"]),
        password: z.string().min(1, t("validation.passwordRequired")),
        confirmPassword: z
          .string()
          .min(1, t("validation.confirmPasswordRequired")),
      }),
    [t],
  );

  const form = useForm<MerchantAccountUpsertValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      merchantId: account?.merchantId ?? preselectedMerchantId,
      name: account?.name ?? "",
      email: account?.email ?? "",
      role: (account?.role ?? "merchant") as UserRole,
      memberRole: (account?.memberRole ?? "staff") as MemberRole,
      status: (account?.status ?? "active") as MerchantMemberStatus,
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    form.reset({
      merchantId: account?.merchantId ?? preselectedMerchantId,
      name: account?.name ?? "",
      email: account?.email ?? "",
      role: (account?.role ?? "merchant") as UserRole,
      memberRole: (account?.memberRole ?? "staff") as MemberRole,
      status: (account?.status ?? "active") as MerchantMemberStatus,
      password: "",
      confirmPassword: "",
    });
  }, [form, preselectedMerchantId, account]);

  const onSubmit = form.handleSubmit((data: MerchantAccountUpsertValues) => {
    if (accountId) {
      updateAccount(accountId, {
        merchantId: data.merchantId,
        name: data.name.trim(),
        email: data.email.trim(),
        role: data.role,
        memberRole: data.memberRole,
        status: data.status,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      router.push("/merchant/account");
      return;
    }

    const newAccount: Account = {
      id: generateId("u"),
      merchantId: data.merchantId,
      name: data.name.trim(),
      email: data.email.trim(),
      role: data.role,
      memberRole: data.memberRole,
      status: data.status,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      password: data.password,
      confirmPassword: data.confirmPassword,
    };

    addAccount(newAccount);
    router.push("/merchant/account");
  });

  const title = accountId ? t("form.editTitle") : t("form.createTitle");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="merchantId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.merchantId")}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 w-full">
                          <SelectValue placeholder={t("form.selectMerchant")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {merchants.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.name}
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.name")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.namePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.email")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.emailPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.role")}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 w-full">
                          <SelectValue placeholder={t("form.selectRole")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ROLE_OPTIONS.map((r) => (
                          <SelectItem key={r} value={r}>
                            {t(`roles.${r}`)}
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
                name="memberRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.memberRole")}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 w-full">
                          <SelectValue
                            placeholder={t("form.selectMemberRole")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MEMBER_ROLE_OPTIONS.map((r) => (
                          <SelectItem key={r} value={r}>
                            {t(`memberRoles.${r}`)}
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.status")}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 w-full">
                          <SelectValue placeholder={t("form.selectStatus")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s} value={s}>
                            {t(`statuses.${s}`)}
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.password")} </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.passwordPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("columns.confirmPassword")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.confirmPasswordPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="mt-4 justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-9"
              onClick={() => {
                router.push(`/${locale}/merchant/member`);
              }}
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              type="submit"
              className="h-9 bg-indigo-600 hover:bg-indigo-700"
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
