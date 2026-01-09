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
import { StatusBadge } from "@/components/status-badge";
import { type BadgeVariant } from "@/components/ui/badge";
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
              value={
                <StatusBadge
                  variant={
                    (
                      {
                        active: "success",
                        suspended: "destructive",
                      } as const
                    )[user.status ?? "active"] || "secondary"
                  }
                >
                  {t(`statuses.${user.status ?? "active"}`)}
                </StatusBadge>
              }
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
              name="merchantId"
              label={t("columns.merchantId")}
              isEditing={false}
              value={
                user.merchantId
                  ? `${merchant?.name ?? "—"} (${user.merchantId})`
                  : "—"
              }
              renderInput={(field) => (
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
