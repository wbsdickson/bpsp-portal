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
import { useMerchantStore } from "@/store/merchant-store";
import { useMerchantMemberStore } from "@/store/merchant-member-store";
import type { MemberRole, User, UserRole } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useBasePath } from "@/hooks/use-base-path";
import { toast } from "sonner";
import { createMerchantMemberSchema } from "../_lib/merchant-member-schema";
import { Eye, EyeOff } from "lucide-react";

type MerchantMemberStatus = "active" | "suspended";

// Removed local types as we use the schema inference where possible, but keeping Status for now
const MEMBER_ROLE_OPTIONS: MemberRole[] = ["owner", "staff", "viewer"];
const STATUS_OPTIONS: MerchantMemberStatus[] = ["active", "suspended"];

export default function MerchantMemberUpsertForm({
  userId,
  onCancel,
  onSuccess,
}: {
  userId?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const t = useTranslations("Operator.MerchantMembers");
  const searchParams = useSearchParams();
  const preselectedMerchantId = searchParams.get("merchantId") ?? "";

  const { basePath } = useBasePath();
  const [showPassword, setShowPassword] = useState(false);

  const user = useMerchantMemberStore((s) =>
    userId ? s.getMemberById(userId) : undefined,
  );

  const merchants = useMerchantStore((s) => s.merchants);
  const addMember = useMerchantMemberStore((s) => s.addMember);
  const updateMember = useMerchantMemberStore((s) => s.updateMember);

  const schema = React.useMemo(() => createMerchantMemberSchema(t), [t]);

  type MerchantMemberUpsertValues = z.infer<typeof schema>;

  const form = useForm<MerchantMemberUpsertValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      merchantId: user?.merchantId ?? preselectedMerchantId,
      name: user?.name ?? "",
      email: user?.email ?? "",
      memberRole: (user?.memberRole ?? "staff") as MemberRole,
      status: (user?.status ?? "active") as MerchantMemberStatus,
      password: "",
    },
  });

  useEffect(() => {
    form.reset({
      merchantId: user?.merchantId ?? preselectedMerchantId,
      name: user?.name ?? "",
      email: user?.email ?? "",
      memberRole: (user?.memberRole ?? "staff") as MemberRole,
      status: (user?.status ?? "active") as MerchantMemberStatus,
      password: "",
    });
  }, [form, preselectedMerchantId, user]);

  const onSubmit = form.handleSubmit((data) => {
    if (userId) {
      updateMember(userId, {
        merchantId: data.merchantId,
        name: data.name.trim(),
        email: data.email.trim(),
        role: "merchant",
        memberRole: data.memberRole,
        status: data.status,
        ...(data.password?.trim()
          ? ({ password: data.password } satisfies Partial<any>)
          : {}),
      });
      toast.success(t("messages.updateSuccess"));
    } else {
      const newUser: User = {
        id: generateId("u"),
        merchantId: data.merchantId,
        name: data.name.trim(),
        email: data.email.trim(),
        role: "merchant",
        memberRole: data.memberRole,
        status: data.status,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        ...(data.password?.trim()
          ? ({ password: data.password } satisfies Partial<any>)
          : {}),
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
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("columns.email")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("form.emailPlaceholder")}
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
            name="memberRole"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("columns.memberRole")}</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder={t("form.selectMemberRole")} />
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
                <FormLabel>{t("columns.password")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      className="h-9 pr-10"
                      placeholder={
                        userId
                          ? t("form.passwordPlaceholderEdit")
                          : t("form.passwordPlaceholder")
                      }
                      value={field.value ?? ""}
                    />
                    <Button
                      
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button
              
              variant="outline"
              className="h-9"
              onClick={onCancel}
            >
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
