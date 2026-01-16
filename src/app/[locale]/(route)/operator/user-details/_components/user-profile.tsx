"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAccountStore } from "@/store/account-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type BadgeVariant } from "@/components/ui/badge";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InlineEditField } from "@/components/inline-edit-field";
import { createUserSchema } from "../../accounts/_lib/user-schema";
import { UserRole } from "@/lib/types";

export default function UserProfile() {
  const { data: session } = useSession();
  const t = useTranslations("Operator.Accounts");

  // Get user ID from session
  const sessionUserId = (session?.user as any)?.id;

  // Still use the store as the source of truth for the latest data (updates)
  const user = useAccountStore((s) =>
    s.accounts.find((u) => u.id === sessionUserId),
  );
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

  if (!sessionUserId) {
    return (
      <div className="text-muted-foreground p-4 text-sm">
        Loading user session...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-muted-foreground p-4 text-sm">
        {t("messages.userNotFound")} (ID: {sessionUserId})
      </div>
    );
  }

  const onSubmit = form.handleSubmit((data) => {
    updateUser(sessionUserId, {
      name: data.name,
      email: data.email,
      // Role is usually not editable by the user themselves in a profile view, but leaving it for now per strict adherence to "user detail" parity
      // In a real app, role might be read-only here.
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
      {/* <div className="flex items-center justify-between">
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
      </div> */}

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

            {/* Role - Read Only for Profile commonly, but kept editable if they are admin/operator self-managing */}
            <div className="space-y-1">
              <div className="text-muted-foreground text-sm font-medium">
                {t("columns.role")}
              </div>
              <div className="flex items-center text-sm font-medium">
                <Badge variant="outline">{t(`roles.${user.role}`)}</Badge>
              </div>
            </div>

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
                    <Badge variant={variantMap[status] || "secondary"}>
                      {t(`statuses.${status}`)}
                    </Badge>
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
