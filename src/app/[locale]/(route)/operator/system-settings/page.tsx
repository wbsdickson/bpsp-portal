"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import HeaderPage from "@/components/header-page";
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
import { Switch } from "@/components/ui/switch";
import { useSystemSettingsStore } from "@/store/system-settings-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { InlineEditField } from "@/components/inline-edit-field";
import { Badge } from "@/components/ui/badge";

type SystemSettingsFormValues = {
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  senderEmailAddress: string;

  enableEmailNotifications: boolean;
  enableInAppNotifications: boolean;

  defaultInvoiceDueDays: string;
  maxLoginAttempts: string;
  sessionTimeoutMinutes: string;
};

export default function SystemSettingsPage() {
  const t = useTranslations("Operator.SystemSettings");

  const settings = useSystemSettingsStore((s) => s.settings);
  const update = useSystemSettingsStore((s) => s.update);
  const resetStore = useSystemSettingsStore((s) => s.reset);
  const [isEditing, setIsEditing] = useState(false);

  const schema = React.useMemo(
    () =>
      z.object({
        smtpHost: z.string().min(1, t("validation.smtpHostRequired")),
        smtpPort: z
          .string()
          .min(1, t("validation.smtpPortRequired"))
          .refine(
            (v) => Number.isFinite(Number(v)),
            t("validation.smtpPortInvalid"),
          ),
        smtpUser: z.string().min(1, t("validation.smtpUserRequired")),
        smtpPassword: z.string().min(1, t("validation.smtpPasswordRequired")),
        senderEmailAddress: z
          .string()
          .min(1, t("validation.senderEmailRequired"))
          .email(t("validation.senderEmailInvalid")),

        enableEmailNotifications: z.boolean(),
        enableInAppNotifications: z.boolean(),

        defaultInvoiceDueDays: z
          .string()
          .min(1, t("validation.defaultInvoiceDueDaysRequired"))
          .refine(
            (v) => Number.isFinite(Number(v)),
            t("validation.defaultInvoiceDueDaysInvalid"),
          ),
        maxLoginAttempts: z
          .string()
          .min(1, t("validation.maxLoginAttemptsRequired"))
          .refine(
            (v) => Number.isFinite(Number(v)),
            t("validation.maxLoginAttemptsInvalid"),
          ),
        sessionTimeoutMinutes: z
          .string()
          .min(1, t("validation.sessionTimeoutMinutesRequired"))
          .refine(
            (v) => Number.isFinite(Number(v)),
            t("validation.sessionTimeoutMinutesInvalid"),
          ),
      }),
    [t],
  );

  const form = useForm<SystemSettingsFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      smtpHost: settings.smtpHost,
      smtpPort: String(settings.smtpPort),
      smtpUser: settings.smtpUser,
      smtpPassword: settings.smtpPassword,
      senderEmailAddress: settings.senderEmailAddress,

      enableEmailNotifications: settings.enableEmailNotifications,
      enableInAppNotifications: settings.enableInAppNotifications,

      defaultInvoiceDueDays: String(settings.defaultInvoiceDueDays),
      maxLoginAttempts: String(settings.maxLoginAttempts),
      sessionTimeoutMinutes: String(settings.sessionTimeoutMinutes),
    },
  });

  useEffect(() => {
    if (!isEditing) {
      form.reset({
        smtpHost: settings.smtpHost,
        smtpPort: String(settings.smtpPort),
        smtpUser: settings.smtpUser,
        smtpPassword: settings.smtpPassword,
        senderEmailAddress: settings.senderEmailAddress,

        enableEmailNotifications: settings.enableEmailNotifications,
        enableInAppNotifications: settings.enableInAppNotifications,

        defaultInvoiceDueDays: String(settings.defaultInvoiceDueDays),
        maxLoginAttempts: String(settings.maxLoginAttempts),
        sessionTimeoutMinutes: String(settings.sessionTimeoutMinutes),
      });
    }
  }, [form, settings, isEditing]);

  const onSubmit = form.handleSubmit((data) => {
    update({
      smtpHost: data.smtpHost,
      smtpPort: Number(data.smtpPort),
      smtpUser: data.smtpUser,
      smtpPassword: data.smtpPassword,
      senderEmailAddress: data.senderEmailAddress,

      enableEmailNotifications: data.enableEmailNotifications,
      enableInAppNotifications: data.enableInAppNotifications,

      defaultInvoiceDueDays: Number(data.defaultInvoiceDueDays),
      maxLoginAttempts: Number(data.maxLoginAttempts),
      sessionTimeoutMinutes: Number(data.sessionTimeoutMinutes),
    });

    toast.success(t("messages.updateSuccess"));
    setIsEditing(false);
  });

  const onCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const updatedAtLabel = settings.updatedAt
    ? (() => {
        const dt = new Date(settings.updatedAt);
        return Number.isNaN(dt.getTime())
          ? settings.updatedAt
          : dt.toLocaleString();
      })()
    : "—";

  return (
    <HeaderPage
      containerClassName="max-w-5xl"
      title={t("title")}
      pageActions={
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={onCancel}
                title={t("buttons.cancel")}
              >
                {t("buttons.discard")}
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={onSubmit}
                title={t("buttons.save")}
              >
                {t("buttons.save")}
              </Button>
            </>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(true)}
              title={t("actions.edit")}
            >
              {t("actions.edit")}
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("sections.emailServer")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <InlineEditField
                    control={form.control}
                    name="smtpHost"
                    label={t("fields.smtpHost")}
                    isEditing={isEditing}
                    value={settings.smtpHost}
                    renderInput={(field) => (
                      <Input className="h-9" {...field} />
                    )}
                  />

                  <InlineEditField
                    control={form.control}
                    name="smtpPort"
                    label={t("fields.smtpPort")}
                    isEditing={isEditing}
                    value={settings.smtpPort}
                    renderInput={(field) => (
                      <Input
                        type="number"
                        inputMode="numeric"
                        className="h-9"
                        {...field}
                      />
                    )}
                  />

                  <InlineEditField
                    control={form.control}
                    name="smtpUser"
                    label={t("fields.smtpUser")}
                    isEditing={isEditing}
                    value={settings.smtpUser}
                    renderInput={(field) => (
                      <Input
                        className="h-9"
                        autoComplete="username"
                        {...field}
                      />
                    )}
                  />

                  <InlineEditField
                    control={form.control}
                    name="smtpPassword"
                    label={t("fields.smtpPassword")}
                    isEditing={isEditing}
                    value={settings.smtpPassword ? "••••••••" : ""}
                    renderInput={(field) => (
                      <Input
                        type="password"
                        className="h-9"
                        autoComplete="current-password"
                        {...field}
                      />
                    )}
                  />

                  <div className="md:col-span-2">
                    <InlineEditField
                      control={form.control}
                      name="senderEmailAddress"
                      label={t("fields.senderEmailAddress")}
                      isEditing={isEditing}
                      value={settings.senderEmailAddress}
                      renderInput={(field) => (
                        <Input type="email" className="h-9" {...field} />
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("sections.notifications")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <InlineEditField
                  control={form.control}
                  name="enableEmailNotifications"
                  label={t("fields.enableEmailNotifications")}
                  isEditing={isEditing}
                  value={
                    settings.enableEmailNotifications ? (
                      <Badge
                        variant="outline"
                        className="border-green-200 bg-green-50 text-green-700"
                      >
                        {t("status.enabled")}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-gray-200 bg-gray-50 text-gray-500"
                      >
                        {t("status.disabled")}
                      </Badge>
                    )
                  }
                  renderInput={(field) => (
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <span className="text-muted-foreground text-sm">
                        {t("help.enableEmailNotifications")}
                      </span>
                    </div>
                  )}
                />

                <InlineEditField
                  control={form.control}
                  name="enableInAppNotifications"
                  label={t("fields.enableInAppNotifications")}
                  isEditing={isEditing}
                  value={
                    settings.enableInAppNotifications ? (
                      <Badge
                        variant="outline"
                        className="border-green-200 bg-green-50 text-green-700"
                      >
                        {t("status.enabled")}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-gray-200 bg-gray-50 text-gray-500"
                      >
                        {t("status.disabled")}
                      </Badge>
                    )
                  }
                  renderInput={(field) => (
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <span className="text-muted-foreground text-sm">
                        {t("help.enableInAppNotifications")}
                      </span>
                    </div>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("sections.fixedParameters")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <InlineEditField
                    control={form.control}
                    name="defaultInvoiceDueDays"
                    label={t("fields.defaultInvoiceDueDays")}
                    isEditing={isEditing}
                    value={settings.defaultInvoiceDueDays}
                    renderInput={(field) => (
                      <Input
                        type="number"
                        inputMode="numeric"
                        className="h-9"
                        {...field}
                      />
                    )}
                  />

                  <InlineEditField
                    control={form.control}
                    name="maxLoginAttempts"
                    label={t("fields.maxLoginAttempts")}
                    isEditing={isEditing}
                    value={settings.maxLoginAttempts}
                    renderInput={(field) => (
                      <Input
                        type="number"
                        inputMode="numeric"
                        className="h-9"
                        {...field}
                      />
                    )}
                  />

                  <InlineEditField
                    control={form.control}
                    name="sessionTimeoutMinutes"
                    label={t("fields.sessionTimeoutMinutes")}
                    isEditing={isEditing}
                    value={settings.sessionTimeoutMinutes}
                    renderInput={(field) => (
                      <Input
                        type="number"
                        inputMode="numeric"
                        className="h-9"
                        {...field}
                      />
                    )}
                  />

                  <div className="md:col-span-3">
                    <div className="text-muted-foreground text-xs">
                      {t("fields.updatedAt")}: {updatedAtLabel}
                    </div>
                  </div>
                </div>
              </CardContent>

              {isEditing && (
                <CardFooter className="justify-end gap-2">
                  <Button
                    variant="outline"
                    className="h-9"
                    type="button"
                    onClick={() => {
                      resetStore();
                      toast.success(t("messages.resetSuccess"));
                    }}
                  >
                    {t("buttons.reset")}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </form>
        </Form>
      </div>
    </HeaderPage>
  );
}
