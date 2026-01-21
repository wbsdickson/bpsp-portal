"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { useMerchantStore } from "@/store/merchant-store";
import { useMerchantMemberStore } from "@/store/merchant/merchant-member-store";
import type { User, UserRole } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { useBasePath } from "@/hooks/use-base-path";

type MerchantMemberStatus = "active" | "suspended";

const ROLE_OPTIONS: UserRole[] = [
  "merchant_owner",
  "merchant_admin",
  "merchant_viewer",
];

const STATUS_OPTIONS: MerchantMemberStatus[] = ["active", "suspended"];

export default function MerchantMemberUpsertForm({
  onSuccess,
  userId,
}: {
  onSuccess?: () => void;
  userId?: string;
}) {
  const router = useRouter();
  const t = useTranslations("Merchant.MerchantMembers");
  const { basePath } = useBasePath();
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
        role: z.enum(["merchant_owner", "merchant_admin", "merchant_viewer"]),
        status: z.enum(["active", "suspended"]),
      }),
    [t],
  );

  type MerchantMemberUpsertValues = z.infer<typeof schema>;

  const form = useForm<MerchantMemberUpsertValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      merchantId: user?.merchantId ?? preselectedMerchantId,
      name: user?.name ?? "",
      email: user?.email ?? "",
      role: (user?.role ?? "merchant_viewer") as
        | "merchant_owner"
        | "merchant_admin"
        | "merchant_viewer",
      status: (user?.status ?? "active") as MerchantMemberStatus,
    },
  });

  useEffect(() => {
    const userRole = user?.role;
    const validRole =
      userRole === "merchant_owner" ||
      userRole === "merchant_admin" ||
      userRole === "merchant_viewer"
        ? userRole
        : "merchant_viewer";

    form.reset({
      merchantId: user?.merchantId ?? preselectedMerchantId,
      name: user?.name ?? "",
      email: user?.email ?? "",
      role: validRole,
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
        status: data.status,
      });
      toast.success(t("messages.updateSuccess"));
    } else {
      const newUser: User = {
        id: generateId("u"),
        merchantId: data.merchantId,
        name: data.name.trim(),
        email: data.email.trim(),
        role: data.role,
        status: data.status,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      addMember(newUser);
      toast.success(t("messages.createSuccess"));
    }

    if (onSuccess) {
      onSuccess();
    } else {
      router.push(basePath);
    }
  });

  return (
    <div className="bg-card min-h-[calc(100vh-0px)] rounded-lg p-4">
      <div className="bg-card/95 sticky top-0 z-10 border-b backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => router.back()}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex-1">
            <div className="text-xl font-bold">
              {userId ? t("form.editTitle") : t("form.createTitle")}
            </div>
          </div>

          <Button
            size="sm"
            className="h-9"
            onClick={onSubmit}
            disabled={form.formState.isSubmitting}
          >
            {userId ? t("buttons.save") : t("buttons.create")}
          </Button>
        </div>
      </div>

      <div className="p-4">
        <Form {...form}>
          <form className="space-y-6" onSubmit={onSubmit}>
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
          </form>
        </Form>
      </div>
    </div>
  );
}
