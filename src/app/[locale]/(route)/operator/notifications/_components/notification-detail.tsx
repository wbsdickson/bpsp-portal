"use client";

import * as React from "react";
import { useState, useEffect } from "react";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/store/notification-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InlineEditField } from "@/components/inline-edit-field";
import { createNotificationSchema } from "../_lib/notification-schema";

export default function NotificationDetail({ id }: { id: string }) {
  const locale = useLocale();
  const t = useTranslations("Operator.Notifications");

  const notification = useNotificationStore((s) =>
    id ? s.getNotificationById(id) : undefined,
  );
  const updateNotification = useNotificationStore((s) => s.updateNotification);

  const [isEditing, setIsEditing] = useState(false);

  const schema = React.useMemo(() => createNotificationSchema(t), [t]);
  type NotificationDetailValues = z.infer<typeof schema>;

  const form = useForm<NotificationDetailValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: notification?.title ?? "",
      message: notification?.message ?? "",
      merchantId: notification?.merchantId ?? "",
      targetUserType: notification?.targetUserType,
      publicationStartDate: notification?.publicationStartDate ?? "",
      publicationEndDate: notification?.publicationEndDate ?? "",
    },
  });

  useEffect(() => {
    if (notification) {
      form.reset({
        title: notification.title,
        message: notification.message,
        merchantId: notification.merchantId ?? "",
        targetUserType: notification.targetUserType,
        publicationStartDate: notification.publicationStartDate ?? "",
        publicationEndDate: notification.publicationEndDate ?? "",
      });
    }
  }, [notification, form, isEditing]);

  if (!id) {
    return (
      <div className="space-y-4">
        <div className="text-muted-foreground text-sm">
          Missing notification id.
        </div>
        <Button asChild variant="outline" className="h-9">
          <Link href={`/${locale}/operator/notifications`}>
            {t("buttons.back")}
          </Link>
        </Button>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="space-y-4">
        <div className="text-muted-foreground text-sm">
          {t("messages.notFound")}
        </div>
        <Button asChild variant="outline" className="h-9">
          <Link href={`/${locale}/operator/notifications`}>
            {t("buttons.back")}
          </Link>
        </Button>
      </div>
    );
  }

  const onSubmit = form.handleSubmit((data) => {
    updateNotification(id, {
      title: data.title,
      message: data.message,
      merchantId: data.merchantId || undefined,
      targetUserType: data.targetUserType || undefined,
      publicationStartDate: data.publicationStartDate || undefined,
      publicationEndDate: data.publicationEndDate || undefined,
    });
    setIsEditing(false);
  });

  const onCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  return (
    <div className="bg-background space-y-4 rounded-lg p-4">
      <div className="flex items-center justify-end gap-2">
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

      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <InlineEditField
                control={form.control}
                name="title"
                label={t("columns.title")}
                isEditing={isEditing}
                value={notification.title}
                renderInput={(field) => <Input {...field} className="h-9" />}
              />
            </div>

            <InlineEditField
              control={form.control}
              name="publicationStartDate"
              label={t("columns.publicationStartDate")}
              isEditing={isEditing}
              value={
                notification.publicationStartDate
                  ? new Date(notification.publicationStartDate).toLocaleString()
                  : "—"
              }
              renderInput={(field) => (
                <Input {...field} type="datetime-local" className="h-9" />
              )}
            />

            <InlineEditField
              control={form.control}
              name="publicationEndDate"
              label={t("columns.publicationEndDate")}
              isEditing={isEditing}
              value={
                notification.publicationEndDate
                  ? new Date(notification.publicationEndDate).toLocaleString()
                  : "—"
              }
              renderInput={(field) => (
                <Input {...field} type="datetime-local" className="h-9" />
              )}
            />

            <InlineEditField
              control={form.control}
              name="merchantId"
              label="Merchant ID"
              isEditing={isEditing}
              value={notification.merchantId ?? "—"}
              renderInput={(field) => <Input {...field} className="h-9" />}
            />

            <InlineEditField
              control={form.control}
              name="targetUserType"
              label="Target user type"
              isEditing={isEditing}
              value={notification.targetUserType ?? "—"}
              renderInput={(field) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="merchant">Merchant</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            <div className="md:col-span-2">
              <InlineEditField
                control={form.control}
                name="message"
                label={t("form.message")}
                isEditing={isEditing}
                value={notification.message}
                renderInput={(field) => (
                  <Textarea {...field} className="min-h-[100px]" />
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
