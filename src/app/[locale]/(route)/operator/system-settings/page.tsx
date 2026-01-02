"use client";

import * as React from "react";

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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
  }, [form, settings]);

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
  });

  const updatedAtLabel = settings.updatedAt
    ? (() => {
        const dt = new Date(settings.updatedAt);
        return Number.isNaN(dt.getTime())
          ? settings.updatedAt
          : dt.toLocaleString();
      })()
    : "—";

  return (
    <HeaderPage title={t("title")}>
      <div className="max-w-4xl space-y-4">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("sections.emailServer")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="smtpHost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fields.smtpHost")}</FormLabel>
                        <FormControl>
                          <Input className="h-9" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="smtpPort"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fields.smtpPort")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            inputMode="numeric"
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
                    name="smtpUser"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fields.smtpUser")}</FormLabel>
                        <FormControl>
                          <Input
                            className="h-9"
                            autoComplete="username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="smtpPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fields.smtpPassword")}</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            className="h-9"
                            autoComplete="current-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="senderEmailAddress"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>{t("fields.senderEmailAddress")}</FormLabel>
                        <FormControl>
                          <Input type="email" className="h-9" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("sections.notifications")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <FormField
                  control={form.control}
                  name="enableEmailNotifications"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <FormLabel>
                          {t("fields.enableEmailNotifications")}
                        </FormLabel>
                        <div className="text-muted-foreground text-xs">
                          {t("help.enableEmailNotifications")}
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enableInAppNotifications"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <FormLabel>
                          {t("fields.enableInAppNotifications")}
                        </FormLabel>
                        <div className="text-muted-foreground text-xs">
                          {t("help.enableInAppNotifications")}
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("sections.fixedParameters")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="defaultInvoiceDueDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("fields.defaultInvoiceDueDays")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            inputMode="numeric"
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
                    name="maxLoginAttempts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fields.maxLoginAttempts")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            inputMode="numeric"
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
                    name="sessionTimeoutMinutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("fields.sessionTimeoutMinutes")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            inputMode="numeric"
                            className="h-9"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="md:col-span-3">
                    <div className="text-muted-foreground text-xs">
                      {t("fields.updatedAt")}: {updatedAtLabel}
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-9"
                  onClick={() => {
                    resetStore();
                    toast.success(t("messages.resetSuccess"));
                  }}
                >
                  {t("buttons.reset")}
                </Button>
                <Button
                  type="submit"
                  className="h-9 bg-indigo-600 hover:bg-indigo-700"
                  disabled={form.formState.isSubmitting}
                >
                  {t("buttons.save")}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </HeaderPage>
  );
}
