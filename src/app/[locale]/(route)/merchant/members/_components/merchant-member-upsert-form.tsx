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
import { useMerchantMemberStore } from "@/store/merchant/merchant-member-store";
import type { MemberRole, User, UserRole } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type MerchantMemberStatus = "active" | "suspended";

type MerchantMemberUpsertValues = {
  merchantId: string;
  name: string;
  email: string;
  role: UserRole;
  memberRole: MemberRole;
  status: MerchantMemberStatus;
};

const ROLE_OPTIONS: UserRole[] = [
  "merchant",
  "admin",
  "jpcc_admin",
  "merchant_jpcc",
];

const MEMBER_ROLE_OPTIONS: MemberRole[] = ["owner", "staff", "viewer"];

const STATUS_OPTIONS: MerchantMemberStatus[] = ["active", "suspended"];

export default function MerchantMemberUpsertForm({
  onSuccess,
  userId,
}: {
  onSuccess?: () => void;
  userId?: string;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Merchant.MerchantMembers");
  const searchParams = useSearchParams();
  const preselectedMerchantId = searchParams.get("merchantId") ?? "";

  const user = useMerchantMemberStore((s) =>
    userId ? s.getMemberById(userId) : undefined,
  );

  const merchants = useMerchantStore((s) => s.merchants);
  const addMember = useMerchantMemberStore((s) => s.addMember);
  const updateMember = useMerchantMemberStore((s) => s.updateMember);

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
      }),
    [t],
  );

  const form = useForm<MerchantMemberUpsertValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      merchantId: user?.merchantId ?? preselectedMerchantId,
      name: user?.name ?? "",
      email: user?.email ?? "",
      role: (user?.role ?? "merchant") as UserRole,
      memberRole: (user?.memberRole ?? "staff") as MemberRole,
      status: (user?.status ?? "active") as MerchantMemberStatus,
    },
  });

  useEffect(() => {
    form.reset({
      merchantId: user?.merchantId ?? preselectedMerchantId,
      name: user?.name ?? "",
      email: user?.email ?? "",
      role: (user?.role ?? "merchant") as UserRole,
      memberRole: (user?.memberRole ?? "staff") as MemberRole,
      status: (user?.status ?? "active") as MerchantMemberStatus,
    });
  }, [form, preselectedMerchantId, user]);

  const onSubmit = form.handleSubmit((data: MerchantMemberUpsertValues) => {
    if (userId) {
      updateMember(userId, {
        merchantId: data.merchantId,
        name: data.name.trim(),
        email: data.email.trim(),
        role: data.role,
        memberRole: data.memberRole,
        status: data.status,
      });
      if (onSuccess) onSuccess();
      return;
    }

    const newUser: User = {
      id: generateId("u"),
      merchantId: data.merchantId,
      name: data.name.trim(),
      email: data.email.trim(),
      role: data.role,
      memberRole: data.memberRole,
      status: data.status,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    addMember(newUser);
    if (onSuccess) onSuccess();
  });

  const title = userId ? t("form.editTitle") : t("form.createTitle");

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
            </div>
          </CardContent>

          <CardFooter className="mt-4 justify-end gap-2">
            <Button
              variant="outline"
              className="h-9"
              onClick={() => {
                if (onSuccess) onSuccess();
                router.push(`/${locale}/merchant/members`);
              }}
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
