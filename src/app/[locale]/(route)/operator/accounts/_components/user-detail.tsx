"use client";

import * as React from "react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { type BadgeVariant } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLocale, useTranslations } from "next-intl";
import { useAccountStore } from "@/store/account-store";
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
import { type UserRole } from "@/lib/types";
import { InlineEditField } from "@/components/inline-edit-field";
import { createUserSchema } from "../_lib/user-schema";
import { Card } from "@/components/ui/card";

const ROLE_OPTIONS: UserRole[] = ["merchant", "admin"];

export default function UserDetail({ userId }: { userId: string }) {
  const t = useTranslations("Operator.Accounts");
  const user = useAccountStore((s) => s.accounts.find((u) => u.id === userId));
  const updateUser = useAccountStore((s) => s.updateAccount);
  const [isEditing, setIsEditing] = useState(false);

  const schema = React.useMemo(() => createUserSchema(t), [t]);

  type UserDetailValues = z.infer<typeof schema>;

  const form = useForm<UserDetailValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      role: (user?.role ?? "merchant") as UserRole,
      password: "",
    },
  });

  // Reset form when user changes or edit mode closes (cancel)
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        role: user.role as UserRole,
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
    updateUser(userId, {
      name: data.name,
      email: data.email,
      role: data.role,
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

  const lastLoginLabel = user.lastLoginAt
    ? (() => {
        const dt = new Date(user.lastLoginAt);
        return Number.isNaN(dt.getTime())
          ? user.lastLoginAt
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
              renderInput={(field) => <Input {...field} />}
            />

            <InlineEditField
              control={form.control}
              name="email"
              label={t("columns.email")}
              isEditing={isEditing}
              value={user.email}
              renderInput={(field) => <Input {...field} />}
            />

            <InlineEditField
              control={form.control}
              name="role"
              label={t("columns.role")}
              isEditing={isEditing}
              value={t(`roles.${user.role}`)}
              renderInput={(field) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((role) => (
                      <SelectItem key={role} value={role}>
                        {t(`roles.${role}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <div className="space-y-1">
              <div className="text-muted-foreground text-sm font-medium">
                {t("columns.lastLoginAt")}
              </div>
              <div className="flex items-center text-sm font-medium">
                {lastLoginLabel}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground text-sm font-medium">
                {t("columns.status")}
              </div>
              <div className="flex items-center text-sm font-medium capitalize">
                {(() => {
                  const status = user.status;
                  if (!status) return "—";
                  const variantMap: Record<string, BadgeVariant> = {
                    active: "success",
                    suspended: "destructive",
                  };
                  return (
                    <StatusBadge variant={variantMap[status] || "secondary"}>
                      {t(`statuses.${status}`)}
                    </StatusBadge>
                  );
                })()}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground text-sm font-medium">
                {t("columns.company")}
              </div>
              <div className="flex items-center overflow-hidden text-ellipsis text-sm font-medium">
                {user.companyName ?? "—"}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
