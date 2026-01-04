"use client";

import * as React from "react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useMerchantMemberStore } from "@/store/merchant-member-store";
import { useMerchantStore } from "@/store/merchant-store";
import { useTranslations } from "next-intl";
import { Pen, Check, X, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type MemberRole } from "@/lib/types";
import { InlineEditField } from "@/components/inline-edit-field";
import { createMerchantMemberSchema } from "../_lib/merchant-member-schema";
import { Separator } from "@/components/ui/separator";

const MEMBER_ROLE_OPTIONS: MemberRole[] = ["owner", "staff", "viewer"];
type MerchantMemberStatus = "active" | "suspended";
const STATUS_OPTIONS: MerchantMemberStatus[] = ["active", "suspended"];

export default function MerchantMemberDetail({ userId }: { userId: string }) {
  const t = useTranslations("Operator.MerchantMembers");
  const user = useMerchantMemberStore((s) => s.getMemberById(userId));
  const merchant = useMerchantStore((s) =>
    user?.merchantId ? s.getMerchantById(user.merchantId) : undefined,
  );
  const updateMember = useMerchantMemberStore((s) => s.updateMember);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const schema = React.useMemo(() => createMerchantMemberSchema(t), [t]);

  type MemberDetailValues = z.infer<typeof schema>;

  const form = useForm<MemberDetailValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      merchantId: user?.merchantId ?? "",
      name: user?.name ?? "",
      email: user?.email ?? "",
      memberRole: (user?.memberRole ?? "staff") as MemberRole,
      status: (user?.status ?? "active") as MerchantMemberStatus,
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        merchantId: user.merchantId,
        name: user.name,
        email: user.email,
        memberRole: (user.memberRole ?? "staff") as MemberRole,
        status: (user.status ?? "active") as MerchantMemberStatus,
        password: "",
      });
    }
  }, [user, form, isEditing]);

  if (!user) {
    return (
      <div className="text-muted-foreground p-4 text-sm">
        {t("messages.userNotFound")}
      </div>
    );
  }

  const onSubmit = form.handleSubmit((data) => {
    updateMember(userId, {
      merchantId: data.merchantId,
      name: data.name,
      email: data.email,
      role: "merchant", // Preserve hardcoded role if needed or update via schema
      memberRole: data.memberRole,
      status: data.status,
      ...(data.password?.trim()
        ? ({ password: data.password } satisfies Partial<any>)
        : {}),
    });
    setIsEditing(false);
  });

  const onCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const registrationLabel = user.createdAt
    ? (() => {
        const dt = new Date(user.createdAt);
        return Number.isNaN(dt.getTime())
          ? user.createdAt
          : dt.toLocaleString();
      })()
    : "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{user.name}</h2>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={onCancel}
                title={t("buttons.cancel")}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onSubmit}
                title={t("buttons.save")}
                className="text-green-600 hover:bg-green-50 hover:text-green-700"
              >
                <Check className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsEditing(true)}
              title={t("actions.edit")}
            >
              <Pen className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <InlineEditField
              control={form.control}
              name="name"
              label={t("columns.name")}
              isEditing={isEditing}
              value={user.name}
              renderInput={(field) => <Input {...field} className="h-9" />}
            />

            <InlineEditField
              control={form.control}
              name="email"
              label={t("columns.email")}
              isEditing={isEditing}
              value={user.email}
              renderInput={(field) => <Input {...field} className="h-9" />}
            />

            <InlineEditField
              control={form.control}
              name="memberRole"
              label={t("columns.memberRole")}
              isEditing={isEditing}
              value={t(`memberRoles.${user.memberRole ?? "staff"}`)}
              renderInput={(field) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MEMBER_ROLE_OPTIONS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {t(`memberRoles.${r}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <InlineEditField
              control={form.control}
              name="status"
              label={t("columns.status")}
              isEditing={isEditing}
              value={t(`statuses.${user.status ?? "active"}`)}
              renderInput={(field) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {t(`statuses.${s}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <InlineEditField
              control={form.control}
              name="password"
              label="Password"
              isEditing={isEditing}
              value="••••••••"
              renderInput={(field) => (
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    className="h-9 pr-10"
                    placeholder="Reset password"
                    value={field.value ?? ""}
                  />
                  <Button
                    type="button"
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
              )}
            />

            <InlineEditField
              control={form.control}
              name="merchantId"
              label={t("columns.merchantId")}
              isEditing={false} // Keeping merchant read-only in detail usually, or should it be editable? User can move to other merchant? Let's allow edit if it's an operator feature.
              // Actually UserDetail doesn't have merchantId select. This is specific to MerchantMember.
              // If I allow edit, I need the merchant list.
              // Let's assume editable for parity with upsert form, but might be complex if list is huge.
              // For now, let's keep it read-only or editable? Upsert form allows selecting merchant.
              // I'll leave it View-Only for now as changing merchant is a significant action, or implement it if I have `merchants` list.
              // I have `useMerchantStore`.
              value={
                user.merchantId
                  ? `${merchant?.name ?? "—"} (${user.merchantId})`
                  : "—"
              }
              renderInput={(field) => (
                // Placeholder if we wanted to make it editable
                <Input {...field} className="h-9" disabled />
              )}
            />

            <div className="space-y-1">
              <div className="text-muted-foreground text-sm font-medium">
                {t("columns.registrationDate")}
              </div>
              <div className="flex h-9 items-center text-sm font-medium">
                {registrationLabel}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
